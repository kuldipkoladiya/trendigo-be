import httpStatus from 'http-status';
import { catchAsync } from 'utils/catchAsync';
import { razorpayService, cartService } from 'services';
import ApiError from 'utils/ApiError';
import { Payment, Order, Cart } from 'models';

/**
 * Create Razorpay Order
 * This starts the payment process by creating an order in Razorpay
 */
export const createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const cart = await cartService.getCartList({ userId });

  if (!cart || cart.productDetailList.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  const razorpayOrder = await razorpayService.createRazorpayOrder(cart.grandTotal, cart.id.toString());

  res.send({
    success: true,
    data: razorpayOrder,
  });
});

/**
 * Verify Razorpay Payment
 * This verifies the signature and creates the final Order/Payment records
 */
export const verifyPayment = catchAsync(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const userId = req.user.id;

  // 1. Verify Signature
  const isValid = razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);

  if (!isValid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid payment signature');
  }

  // 2. Fetch Cart and Populate Products for Seller Info
  const cart = await cartService.getCartList({ userId });

  if (!cart || cart.productDetailList.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // 3. Create Payment Record
  const payment = await Payment.create({
    userId,
    createdBy: userId,
    amount: cart.grandTotal,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status: 'captured',
  });

  // 4. Group Cart Items by Seller
  const sellerGroups = cart.productDetailList.reduce((acc, item) => {
    const product = item.productId;

    const sellerId = product.sellerId ? product.sellerId.toString() : 'admin';

    if (!acc[sellerId]) {
      acc[sellerId] = {
        items: [],
        total: 0,
      };
    }

    const price = item.variants.price || 0;
    const itemTotal = price * item.quantity;

    acc[sellerId].items.push({
      productId: product.id,
      variants: item.variants.id,
      quantity: item.quantity,
      price,
    });

    acc[sellerId].total += itemTotal;

    return acc;
  }, {});

  // 5. Create Orders for Each Seller
  const timestamp = Date.now();

  const createdOrders = await Promise.all(
    Object.entries(sellerGroups).map(async ([sellerId, sellerData]) => {
      const order = await Order.create({
        userId,
        sellerId: sellerId === 'admin' ? null : sellerId,
        createdBy: userId,
        orderId: `ORD-${timestamp}-${Math.floor(Math.random() * 1000)}`,
        cartId: cart.id,
        paymentId: payment.id,
        productDetailList: sellerData.items,
        grandTotal: sellerData.total,
        deliveryAddress: cart.deliveryAddress,
        status: 'pending',
      });

      return order.id;
    })
  );

  // 6. Update Payment with First Order ID
  if (createdOrders.length > 0) {
    const [firstOrderId] = createdOrders;

    payment.ordeId = firstOrderId;
    await payment.save();
  }

  // 7. Clear Cart
  await Cart.deleteOne({ userId });

  res.send({
    success: true,
    message: 'Payment verified and orders created successfully',
    data: {
      orderIds: createdOrders,
      paymentId: payment.id,
    },
  });
});
