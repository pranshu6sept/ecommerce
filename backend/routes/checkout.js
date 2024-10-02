import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/', (req, res) => {
  const { userId, discountCode } = req.body;

  if (!userId) {
    return ApiResponse(res, 400, 'User ID is required');
  }

  const cart = db.carts[userId];
  if (!cart || cart.length === 0) {
    return ApiResponse(res, 400, 'Cart is empty');
  }

  let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  let discountAmount = 0;

  if (discountCode) {
    const validDiscount = db.discountCodes.find(dc => dc.code === discountCode && !dc.used);
    if (validDiscount) {
      discountAmount = totalAmount * 0.1;
      totalAmount -= discountAmount;
      validDiscount.used = true;
    } else {
      return apiResponse(res, 400, 'Invalid discount code');
    }
  }

  const order = {
    id: db.orders.length + 1,
    userId,
    items: cart,
    totalAmount,
    discountCode,
    discountAmount,
  };

  db.orders.push(order);
  db.orderCount++;
  delete db.carts[userId];

  return ApiResponse(res, 200, 'Order placed successfully', order);
});

export default router;