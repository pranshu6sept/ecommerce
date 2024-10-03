import request from 'supertest';
import express from 'express';
import cartRoutes from './routes/cart.js';
import checkoutRoutes from './routes/checkout.js';
import adminRoutes from './routes/admin.js';
import statsRoutes from './routes/stats.js';
import db from './db.js';

const app = express();
app.use(express.json());
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stats', statsRoutes);

beforeEach(() => {
  // Reset the database before each test
  db.carts = {};
  db.orders = [];
  db.discountCodes = [];
  db.orderCount = 0;
});

describe('Cart API', () => {
  test('POST /api/cart/add should add an item to the cart', async () => {
    const response = await request(app)
      .post('/api/cart/add')
      .send({ userId: 'user123', itemId: '1' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item added to cart successfully');
    expect(db.carts['user123']).toHaveLength(1);
    expect(db.carts['user123'][0].id).toBe('1');
  });
});

describe('Checkout API', () => {
  test('POST /api/checkout should process a checkout without discount', async () => {
    // Add an item to the cart first
    await request(app)
      .post('/api/cart/add')
      .send({ userId: 'user123', itemId: '1' });

    const response = await request(app)
      .post('/api/checkout')
      .send({ userId: 'user123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Order placed successfully');
    expect(db.orders).toHaveLength(1);
    expect(db.carts['user123']).toBeUndefined();
  });

  test('POST /api/checkout should process a checkout with a discount', async () => {
    // Generate a discount code
    await request(app)
      .post('/api/admin/generate-discount')
      .send({ n: 1 });

    const discountCode = db.discountCodes[0].code;

    // Add an item to the cart
    await request(app)
      .post('/api/cart/add')
      .send({ userId: 'user123', itemId: '1' });

    const response = await request(app)
      .post('/api/checkout')
      .send({ userId: 'user123', discountCode });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Order placed successfully');
    expect(db.orders[0].discountAmount).toBeGreaterThan(0);
  });
});

describe('Admin API', () => {
  test('POST /api/admin/generate-discount should generate a discount code', async () => {
    const response = await request(app)
      .post('/api/admin/generate-discount')
      .send({ n: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Discount code generated successfully');
    expect(db.discountCodes).toHaveLength(1);
  });
});

describe('Stats API', () => {
  test('GET /api/stats/order-stats should return correct order statistics', async () => {
    // Add items to cart and checkout
    await request(app)
      .post('/api/cart/add')
      .send({ userId: 'user123', itemId: '1' });
    await request(app)
      .post('/api/checkout')
      .send({ userId: 'user123' });

    const response = await request(app).get('/api/stats/order-stats');

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('itemsPurchased');
    expect(response.body.data).toHaveProperty('totalPurchaseAmount');
    expect(response.body.data).toHaveProperty('discountCodes');
    expect(response.body.data).toHaveProperty('totalDiscountAmount');
  });
});