import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config/config';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

/**
 * Create a Razorpay Order
 * @param {number} amount - Amount in INR (will be converted to paise)
 * @param {string} receipt - Receipt ID (e.g., cart ID)
 * @returns {Promise<Object>}
 */
export async function createRazorpayOrder(amount, receipt) {
  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit
    currency: 'INR',
    receipt,
  };
  return razorpay.orders.create(options);
}

/**
 * Verify Razorpay Signature
 * @param {string} orderId
 * @param {string} paymentId
 * @param {string} signature
 * @returns {boolean}
 */
export function verifySignature(orderId, paymentId, signature) {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto.createHmac('sha256', config.razorpay.keySecret).update(body.toString()).digest('hex');
  return expectedSignature === signature;
}
