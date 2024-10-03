import express from 'express';
import db from '../db.js';
import ApiResponse from '../utils/ApiResponse.js';

const router = express.Router();

router.post('/generate-discount', (req, res) => {
    // Extract the 'n' value from the request body
    const { n } = req.body;
  
    // Validate the input
    if (!n || n < 0) {
      return ApiResponse(res, 400, 'Invalid value for n');
    }
  
    // Check if the current order count plus one matches the requested 'n' 
    // to generate a discount code for the next order
    if (db.orderCount + 1 === n) {
      // Generate a random discount code
      const code = Math.random().toString(36).substring(7).toUpperCase();
      
      // Create a discount code object
      const discountCode = { code, used: false };
      
      // Add the discount code to the database
      db.discountCodes.push(discountCode);
      
      // Return success response with the generated code
      return ApiResponse(res, 200, 'Discount code generated successfully', { code });
    } else {
      // Return response indicating no discount code was generated
      return ApiResponse(res, 200, 'No discount code generated');
    }
  });

export default router;