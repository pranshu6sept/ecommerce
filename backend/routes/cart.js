import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/add', (req, res) => {
  // Extract userId and itemId from the request body
  const { userId, itemId } = req.body;

  // Validate that both userId and itemId are provided
  if (!userId || !itemId) {
    return ApiResponse(res, 400, 'User ID and Item ID are required');
  }

  // Find the item in the database
  const item = db.items.find(item => item.id === itemId);
  // If the item doesn't exist, return a 404 error
  if (!item) {
    return ApiResponse(res, 404, 'Item not found');
  }

  // Initialize the user's cart if it doesn't exist
  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }

  // Add the item to the user's cart
  db.carts[userId].push(item);

  // Return a success response with the updated cart
  return ApiResponse(res, 200, 'Item added to cart successfully', db.carts[userId]);
});

export default router;