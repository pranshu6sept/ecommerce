import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/generate-discount', (req, res) => {
    const { n } = req.body;
  
    if (!n || n <= 0) {
      return ApiResponse(res, 400, 'Invalid value for n');
    }
  
    if (db.orderCount % n === 0) {
      const code = Math.random().toString(36).substring(7).toUpperCase();
      const discountCode = { code, used: false };
      db.discountCodes.push(discountCode);
      return ApiResponse(res, 200, 'Discount code generated successfully', { code });
    } else {
      return ApiResponse(res, 200, 'No discount code generated');
    }
  });

export default router;