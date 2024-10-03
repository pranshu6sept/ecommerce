# E-commerce Backend API

This project provides a backend API for an e-commerce platform, allowing users to manage their shopping cart, apply discount codes, and retrieve order statistics. The API is built with Node.js and Express, using an in-memory database for simplicity.

## Project Setup

1. Clone the repository and navigate to the project directory:
    ```bash
    git clone https://github.com/pranshu6sept/ecommerce.git
    cd backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the server:
    ```bash
    npm start
    ```

    The server will start running on `http://localhost:3000` by default.

4. Run the tests:
    ```bash
    npm test
    ```

---

## API Endpoints

### 1. Add Item to Cart

- **URL**: `/api/cart/add`
- **Method**: `POST`
- **Description**: Adds an item to a user's cart.

#### Example Curl Command:
```bash
curl -X POST http://localhost:3000/api/cart/add \
     -H "Content-Type: application/json" \
     -d '{
           "userId": "user123",
           "itemId": "1",
           "quantity": 2
         }'
```

### 2. Checkout

- **URL**: `/api/checkout`
- **Method**: `POST`
- **Description**: Processes the checkout for a user, applying a discount code if valid.

#### Example Curl Command (without discount):
```bash
curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{
           "userId": "user123"
         }'
```

#### Example Curl Command (with discount):
```bash
curl -X POST http://localhost:3000/api/checkout \
     -H "Content-Type: application/json" \
     -d '{
           "userId": "user123",
           "discountCode": "DISCOUNT10"
         }'
        #  replace discount code with the one generated in the next step
```

### 3. Discount Code Generation

- **URL**: `/api/admin/generate-discount`
- **Method**: `POST`
- **Description**: Generates a discount code for a user to be used in the nth order

#### Example Curl Command:
```bash
curl -X POST http://localhost:3000/api/admin/generate-discount \
     -H "Content-Type: application/json" \
     -d '{
           "n": 1
         }'
```

### 4. Order Statistics

- **URL**: `/api/stats/order-stats`
- **Method**: `GET`
- **Description**: Retrieves order statistics including total items purchased, total purchase amount, discount codes, and total discount amount.

#### Example Curl Command:
```bash
curl -X GET http://localhost:3000/api/stats/order-stats
```

## Database Structure
The project uses an in-memory database represented by a JavaScript object with the following structure:
- items: Array of available items
- carts: Object storing user carts
- orders: Array of completed orders
- discountCodes: Array of generated discount codes
-orderCount: Number of total orders

## API Response Format
All API responses follow a standard format with the following structure
    {
    "status": number,
    "message": string,
    "data": object (optional)
    }

## Testing Flow

To test the full flow of the application:
  1. Add items to a user's cart using the "Add Item to Cart" endpoint.
  2. Generate a discount code using the "Generate Discount Code" endpoint.
  3. Perform a checkout with discount code using the "Checkout" endpoint by using the discount code generated in the previous step.
  4. Add more items to the cart and perform a checkout without discount code.
  5. Check the order statistics using the "Get Order Statistics" endpoint.

This documentation provides a concise overview of the API endpoints, how to use them with curl commands, and the general structure of the application. It should be sufficient for users to understand and interact with your e-commerce backend API.
