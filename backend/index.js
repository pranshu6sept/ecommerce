import express from 'express';
const app = express();
app.use(express.json());

// Import routes
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import adminRoutes from './routes/admin.js';
import statsRoutes from './routes/stats.js';

// Use routes
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});