import admin from 'firebase-admin';

let messaging = null;

try {
  // Check if firebase app is already initialized
  if (!admin.apps.length) {
    // eslint-disable-next-line global-require
    const serviceAccount = require('../config/firebase.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  messaging = admin.messaging();
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK Initialization Warning:', error.message);
}

/**
 * Verify if an FCM Token is valid by performing a dryRun send
 * @param {string} fcmToken
 * @returns {Promise<boolean>}
 */
export const verifyFCMToken = async (fcmToken) => {
  if (!messaging) {
    console.warn('Firebase Messaging not initialized.');
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
    console.error('FCM Token verification error:', er.message);
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

  return messaging.send(payload);
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
    tokens: deviceTokens,
    notification: {
      title: message.title || 'Notification',
      body: message.body || '',
      ...(message.imageUrl && { imageUrl: message.imageUrl }),
    },
    data: message.data ? Object.fromEntries(Object.entries(message.data).map(([k, v]) => [k, String(v)])) : {},
  };

  return messaging.sendEachForMulticast(payload);
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

  const tokens = user.deviceTokens.map((dt) => dt.deviceToken).filter(Boolean);
  if (!tokens.length) return null;

  return sendMulticastNotification(tokens, message);
};
