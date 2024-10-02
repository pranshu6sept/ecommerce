import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/add', (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return ApiResponse(res, 400, 'User ID and Item ID are required');
  }

  const item = db.items.find(item => item.id === itemId);
  if (!item) {
    return ApiResponse(res, 404, 'Item not found');
  }

  if (!db.carts[userId]) {
    db.carts[userId] = [];
  }

  db.carts[userId].push(item);

  return ApiResponse(res, 200, 'Item added to cart successfully', db.carts[userId]);
});

export default router;