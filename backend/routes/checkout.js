import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';


const router = express.Router();


router.post('/', (req, res) => {
  // Extract userId and discountCode from the request body
  const { userId, discountCode } = req.body;

  // Validate that userId is provided
  if (!userId) {
    return ApiResponse(res, 400, 'User ID is required');
  }

  // Get the user's cart
  const cart = db.carts[userId];
  // Check if the cart exists and is not empty
  if (!cart || cart.length === 0) {
    return ApiResponse(res, 400, 'Cart is empty');
  }

  // Calculate the total amount of the cart
  let totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  let discountAmount = 0;

  // Apply discount if a valid code is provided
  if (discountCode) {
    const validDiscount = db.discountCodes.find(dc => dc.code === discountCode && !dc.used);
    if (validDiscount) {
      // Apply 10% discount
      discountAmount = totalAmount * 0.1;
      totalAmount -= discountAmount;
      validDiscount.used = true;
    } else {
      return ApiResponse(res, 400, 'Invalid discount code');
    }
  }

  // Create a new order object
  const order = {
    id: db.orders.length + 1,
    userId,
    items: cart,
    totalAmount,
    discountCode,
    discountAmount,
  };

  // Save the order and update the database
  db.orders.push(order);
  db.orderCount++;
  // Clear the user's cart after successful order
  delete db.carts[userId];

  // Return a success response with the order details
  return ApiResponse(res, 200, 'Order placed successfully', order);
});

export default router;