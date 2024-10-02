import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.get('/order-stats', (req, res) => {
    const itemsPurchased = db.orders.reduce((sum, order) => sum + order.items.length, 0);
    const totalPurchaseAmount = db.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const discountCodes = db.discountCodes.map(dc => dc.code);
    const totalDiscountAmount = db.orders.reduce((sum, order) => sum + order.discountAmount, 0);
  
    const stats = {
      itemsPurchased,
      totalPurchaseAmount,
      discountCodes,
      totalDiscountAmount,
    };
  
    return ApiResponse(res, 200, 'Order statistics retrieved successfully', stats);
  });
  
  export default router;