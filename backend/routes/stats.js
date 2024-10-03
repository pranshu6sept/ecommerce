import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.get('/order-stats', (req, res) => {
    // Calculate total number of items purchased across all orders
    const itemsPurchased = db.orders.reduce((sum, order) => sum + order.items.length, 0);
    
    // Calculate total purchase amount across all orders
    const totalPurchaseAmount = db.orders.reduce((sum, order) => sum + order.totalAmount, 0);
    
    // Get an array of all discount codes
    const discountCodes = db.discountCodes.map(dc => dc.code);
    
    // Calculate total discount amount applied across all orders
    const totalDiscountAmount = db.orders.reduce((sum, order) => sum + order.discountAmount, 0);
    
    // Get the total number of orders
    const orderCount = db.orderCount;
  
    // Compile all statistics into a single object
    const stats = {
      itemsPurchased,
      totalPurchaseAmount,
      discountCodes,
      totalDiscountAmount,
      orderCount,
    };
  
    // Return the statistics with a success response
    return ApiResponse(res, 200, 'Order statistics retrieved successfully', stats);
  });
  
  export default router;