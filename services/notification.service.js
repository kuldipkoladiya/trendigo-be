import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { logger } from '../config/logger';

let messaging = null;

try {
  if (!admin.apps.length) {
    let serviceAccount = null;

    // 1. Check environment variable FIREBASE_SERVICE_ACCOUNT (JSON string)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      } catch (e) {
        logger.error('Failed to parse FIREBASE_SERVICE_ACCOUNT JSON from environment');
      }
    }

    // 2. Check candidate file paths
    if (!serviceAccount) {
      const candidatePaths = [
        process.env.FIREBASE_CONFIG_PATH,
        path.resolve(process.cwd(), 'config', 'firebase.json'),
        path.resolve(process.cwd(), 'build', 'config', 'firebase.json'),
        path.resolve(__dirname, '..', 'config', 'firebase.json'),
        path.resolve(__dirname, '..', '..', 'config', 'firebase.json'),
      ].filter(Boolean);

      candidatePaths.some((p) => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (fs.existsSync(p)) {
          try {
            // eslint-disable-next-line security/detect-non-literal-fs-filename
            const rawData = fs.readFileSync(p, 'utf8');
            serviceAccount = JSON.parse(rawData);
            logger.info(`Loaded Firebase configuration from: ${p}`);
            return true;
          } catch (err) {
            logger.warn(`Could not read Firebase config at ${p}: ${err.message}`);
          }
        }
        return false;
      });
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      messaging = admin.messaging();
      logger.info('✅ Firebase Admin SDK initialized successfully.');
    } else {
      logger.warn('⚠️ Firebase Admin SDK: firebase.json not found in config/ or environment.');
    }
  } else {
    messaging = admin.messaging();
  }
} catch (error) {
  logger.warn(`⚠️ Firebase Admin SDK Initialization Warning: ${error.message}`);
}

/**
 * Verify if an FCM Token is valid by performing a dryRun send
 * @param {string} fcmToken
 * @returns {Promise<boolean>}
 */
export const verifyFCMToken = async (fcmToken) => {
  if (!messaging) {
    logger.warn('Firebase Messaging not initialized.');
    return false;
  }
  try {
    const isValid = await messaging.send(
      {
        token: fcmToken,
      },
      true // dryRun = true
    );
    return !!isValid;
  } catch (er) {
    logger.warn(`FCM Token verification warning: ${er.message}`);
    return false;
  }
};

/**
 * Send Notification to a single device token
 * @param {string} deviceToken
 * @param {Object} message - { title, body, imageUrl, data }
 * @returns {Promise<any>}
 */
export const sendNotification = async (deviceToken, message = {}) => {
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  const payload = {
    token: deviceToken,
    notification: {
      title: message.title || 'Notification',
      body: message.body || '',
      ...(message.imageUrl && { imageUrl: message.imageUrl }),
    },
    data: message.data ? Object.fromEntries(Object.entries(message.data).map(([k, v]) => [k, String(v)])) : {},
  };

  try {
    const response = await messaging.send(payload);
    logger.info(
      `📱 [FCM Notification Sent] Title: "${payload.notification.title}" | Body: "${
        payload.notification.body
      }" | Token: ${deviceToken.substring(0, 25)}... | MessageId: ${response}`
    );
    return response;
  } catch (error) {
    logger.error(`❌ [FCM Notification Error] Token: ${deviceToken.substring(0, 25)}... | Reason: ${error.message}`);
    throw error;
  }
};

/**
 * Send Notification to multiple device tokens (Multicast)
 * @param {string[]} deviceTokens
 * @param {Object} message - { title, body, imageUrl, data }
 * @returns {Promise<any>}
 */
export const sendMulticastNotification = async (deviceTokens = [], message = {}) => {
  if (!messaging) {
    throw new Error('Firebase Messaging is not initialized');
  }

  if (!deviceTokens || !deviceTokens.length) {
    return null;
  }

  const payload = {
    notification: {
      title: message.title || 'Notification',
      body: message.body || '',
      ...(message.imageUrl && { imageUrl: message.imageUrl }),
    },
    data: message.data ? Object.fromEntries(Object.entries(message.data).map(([k, v]) => [k, String(v)])) : {},
  };

  try {
    const results = await Promise.allSettled(
      deviceTokens.map((t) =>
        messaging.send({
          token: t,
          notification: payload.notification,
          data: payload.data,
        })
      )
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const failureCount = results.length - successCount;
    const response = { successCount, failureCount, responses: results };

    logger.info(
      `📢 [FCM Multicast Sent] Title: "${payload.notification.title}" | Success: ${successCount}/${deviceTokens.length} | Failure: ${failureCount}`
    );
    return response;
  } catch (error) {
    logger.error(`❌ [FCM Multicast Error] Title: "${payload.notification.title}" | Reason: ${error.message}`);
    throw error;
  }
};

/**
 * Send Notification to all devices of a User document
 * @param {Object} user - User document containing deviceTokens array
 * @param {Object} message - { title, body, imageUrl, data }
 */
export const sendToUser = async (user, message = {}) => {
  if (!user || !user.deviceTokens || !user.deviceTokens.length) {
    return null;
  }

  const tokens = user.deviceTokens.map((dt) => (typeof dt === 'string' ? dt : dt.deviceToken)).filter(Boolean);
  if (!tokens.length) return null;

  return sendMulticastNotification(tokens, message);
};

/**
 * Send Welcome Notification to customer
 * @param {Object|string} target - User document or FCM device token string
 * @param {string} [userName] - Customer's name
 * @returns {Promise<any>}
 */
export const sendWelcomeNotification = async (target, userName = '') => {
  const greeting = userName ? `Hi ${userName}, welcome` : 'Welcome';
  const message = {
    title: '🎉 Welcome to Trendigo!',
    body: `${greeting} to Trendigo! Explore trending products and exclusive deals.`,
    data: {
      type: 'WELCOME',
      action: 'EXPLORE_STORE',
      timestamp: String(Date.now()),
    },
  };

  try {
    logger.info(`✨ [Welcome Notification] Dispatching welcome push notification...`);
    if (typeof target === 'string') {
      return await sendNotification(target, message);
    }
    return await sendToUser(target, message);
  } catch (error) {
    logger.error(`⚠️ Failed to send welcome notification: ${error.message}`);
    return null;
  }
};

/**
 * Send Abandoned Cart Reminder Notification to a user
 * @param {Object|string} target - User document, userId, or deviceToken
 * @param {Object} [options] - { itemCount, cartId, customMessage }
 * @returns {Promise<any>}
 */
export const sendAbandonedCartNotification = async (target, options = {}) => {
  const { itemCount, cartId, customMessage } = options;
  const itemText = itemCount ? `${itemCount} item${itemCount > 1 ? 's' : ''}` : 'your items';
  const message = {
    title: '🛒 You left items in your cart!',
    body: customMessage || `You left ${itemText} in your shopping bag. Complete your order before stock runs out!`,
    data: {
      type: 'ABANDONED_CART',
      action: 'VIEW_CART',
      ...(cartId && { cartId: String(cartId) }),
      timestamp: String(Date.now()),
    },
  };

  try {
    logger.info(`🛒 [Abandoned Cart Notification] Dispatching reminder...`);
    if (typeof target === 'string' && target.includes(':')) {
      return await sendNotification(target, message);
    }
    let userDoc = target;
    if (typeof target === 'string' || (target && target._id && !target.deviceTokens)) {
      const User = mongoose.model('User');
      userDoc = await User.findById(target._id || target);
    }
    return await sendToUser(userDoc, message);
  } catch (error) {
    logger.error(`⚠️ Failed to send abandoned cart notification: ${error.message}`);
    return null;
  }
};

/**
 * Send Wishlist Price Drop Notification to all users who wishlisted a product
 * @param {Object} data - { productId, productName, oldPrice, newPrice, imageUrl }
 * @returns {Promise<any>}
 */
export const sendWishlistPriceDropNotification = async (data = {}) => {
  const { productId, productName, oldPrice, newPrice, imageUrl } = data;
  if (!productId) return null;

  try {
    const UserWishlist = mongoose.model('UserWishlist');
    const User = mongoose.model('User');

    const wishlists = await UserWishlist.find({
      productId: mongoose.Types.ObjectId(productId),
      isDeleted: { $ne: true },
    }).lean();

    if (!wishlists.length) {
      logger.info(`ℹ️ [Wishlist Price Drop] No users have wishlisted product ${productId}`);
      return null;
    }

    const userIds = wishlists.map((w) => w.userId).filter(Boolean);
    const users = await User.find({
      _id: { $in: userIds },
      'deviceTokens.0': { $exists: true },
    }).lean();

    const deviceTokens = [];
    users.forEach((u) => {
      if (Array.isArray(u.deviceTokens)) {
        u.deviceTokens.forEach((dt) => {
          const t = typeof dt === 'string' ? dt : dt.deviceToken;
          if (t && !deviceTokens.includes(t)) deviceTokens.push(t);
        });
      }
    });

    if (!deviceTokens.length) {
      logger.info(`ℹ️ [Wishlist Price Drop] No device tokens found for wishlisted users on product ${productId}`);
      return null;
    }

    const priceText = oldPrice ? `₹${newPrice} (was ₹${oldPrice})` : `₹${newPrice}`;
    const nameText = productName ? `"${productName}"` : 'An item in your wishlist';

    const message = {
      title: '🔥 Price Drop Alert!',
      body: `Great news! ${nameText} is now available for ${priceText}. Grab it before the deal ends!`,
      imageUrl: imageUrl || '',
      data: {
        type: 'PRICE_DROP',
        action: 'VIEW_PRODUCT',
        productId: String(productId),
        newPrice: String(newPrice || ''),
        oldPrice: String(oldPrice || ''),
        timestamp: String(Date.now()),
      },
    };

    logger.info(`🔥 [Wishlist Price Drop] Dispatching to ${deviceTokens.length} device(s)...`);
    return await sendMulticastNotification(deviceTokens, message);
  } catch (error) {
    logger.error(`⚠️ Failed to send wishlist price drop notification: ${error.message}`);
    return null;
  }
};

/**
 * Send Back in Stock Notification to users who wishlisted an out-of-stock product
 * @param {Object} data - { productId, productName, imageUrl }
 * @returns {Promise<any>}
 */
export const sendBackInStockNotification = async (data = {}) => {
  const { productId, productName, imageUrl } = data;
  if (!productId) return null;

  try {
    const UserWishlist = mongoose.model('UserWishlist');
    const User = mongoose.model('User');

    const wishlists = await UserWishlist.find({
      productId: mongoose.Types.ObjectId(productId),
      isDeleted: { $ne: true },
    }).lean();

    if (!wishlists.length) return null;

    const userIds = wishlists.map((w) => w.userId).filter(Boolean);
    const users = await User.find({
      _id: { $in: userIds },
      'deviceTokens.0': { $exists: true },
    }).lean();

    const deviceTokens = [];
    users.forEach((u) => {
      if (Array.isArray(u.deviceTokens)) {
        u.deviceTokens.forEach((dt) => {
          const t = typeof dt === 'string' ? dt : dt.deviceToken;
          if (t && !deviceTokens.includes(t)) deviceTokens.push(t);
        });
      }
    });

    if (!deviceTokens.length) return null;

    const nameText = productName ? `"${productName}"` : 'Your saved item';
    const message = {
      title: '✨ Back in Stock!',
      body: `Hooray! ${nameText} is back in stock. Order now before it runs out again!`,
      imageUrl: imageUrl || '',
      data: {
        type: 'BACK_IN_STOCK',
        action: 'VIEW_PRODUCT',
        productId: String(productId),
        timestamp: String(Date.now()),
      },
    };

    logger.info(`✨ [Back in Stock] Dispatching to ${deviceTokens.length} device(s)...`);
    return await sendMulticastNotification(deviceTokens, message);
  } catch (error) {
    logger.error(`⚠️ Failed to send back-in-stock notification: ${error.message}`);
    return null;
  }
};

/**
 * Send Real-time Chat Push Notification to Receiver
 * @param {Object} data - { senderId, senderModel, receiverId, receiverModel, message, chatMessage }
 * @returns {Promise<any>}
 */
export const sendChatNotification = async (data = {}) => {
  const { senderId, senderModel, receiverId, receiverModel, message, chatMessage } = data;
  if (!receiverId || !receiverModel) return null;

  try {
    // 1. Fetch Sender Info for notification display name
    let senderName = 'Someone';
    if (mongoose.Types.ObjectId.isValid(senderId)) {
      if (senderModel === 'SellerUser') {
        const SellerUser = mongoose.model('SellerUser');
        const seller = await SellerUser.findById(senderId).select('name businessName').lean();
        if (seller) senderName = seller.businessName || seller.name || 'Seller';
      } else {
        const User = mongoose.model('User');
        const user = await User.findById(senderId).select('name role email').populate('role', 'role').lean();
        if (user) {
          const roleName = user.role && user.role.role;
          const isAdmin = ['admin', 'super-admin', 'co-admin'].includes(roleName);
          senderName = isAdmin ? 'Trendigo Support' : user.name || 'Customer';
        }
      }
    }

    // 2. Fetch Receiver User/Seller and device tokens
    let receiverTokens = [];
    if (mongoose.Types.ObjectId.isValid(receiverId)) {
      if (receiverModel === 'SellerUser') {
        const SellerUser = mongoose.model('SellerUser');
        const seller = await SellerUser.findById(receiverId).select('deviceTokens').lean();
        if (seller && Array.isArray(seller.deviceTokens)) {
          receiverTokens = seller.deviceTokens.map((d) => (typeof d === 'string' ? d : d.deviceToken)).filter(Boolean);
        }
      } else {
        const User = mongoose.model('User');
        const receiver = await User.findById(receiverId).select('deviceTokens').lean();
        if (receiver && Array.isArray(receiver.deviceTokens)) {
          receiverTokens = receiver.deviceTokens.map((d) => (typeof d === 'string' ? d : d.deviceToken)).filter(Boolean);
        }
      }
    }

    if (!receiverTokens.length) {
      return null;
    }

    let messageText = 'New message';
    if (message && message.trim()) {
      messageText = message.length > 80 ? `${message.substring(0, 77)}...` : message;
    } else if (chatMessage && chatMessage.fileUrl) {
      messageText = 'Sent an attachment';
    }

    const pushPayload = {
      title: `💬 ${senderName}`,
      body: messageText,
      data: {
        type: 'CHAT_MESSAGE',
        action: 'OPEN_CHAT',
        senderId: String(senderId),
        senderModel: String(senderModel || 'User'),
        receiverId: String(receiverId),
        receiverModel: String(receiverModel || 'User'),
        messageId: String(chatMessage ? chatMessage._id || chatMessage.id || '' : ''),
        timestamp: String(Date.now()),
      },
    };

    logger.info(`💬 [Chat Notification] Sending message alert from "${senderName}" to ${receiverTokens.length} device(s)`);
    return await sendMulticastNotification(receiverTokens, pushPayload);
  } catch (error) {
    logger.error(`⚠️ Failed to send chat notification: ${error.message}`);
    return null;
  }
};
