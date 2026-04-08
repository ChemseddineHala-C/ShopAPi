# ShopAPI — Production-Grade E-commerce REST API

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express-REST_API-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Status](https://img.shields.io/badge/Project-Capstone-orange)

A **production-style e-commerce backend API** built with **Node.js, Express, MongoDB, and Mongoose**.

This project simulates a real online store backend with:
- secure authentication
- role-based authorization
- product lifecycle management
- image uploads
- order processing
- stock consistency
- purchase-verified reviews
- average rating recalculation
- filtering, sorting, and pagination
- hardened Express security middleware

---

# Why This Project Matters
This is not a toy CRUD app.

The difficult part is the **business logic consistency**:
- stock must never go negative
- cancelled orders must restore stock
- reviews require delivered purchases
- duplicate reviews are blocked
- historical purchase prices must remain immutable
- product ratings must stay synchronized with reviews

These are the kinds of constraints that make backend systems realistic.

---

# Architecture Overview

```text
Client → Routes → Validators → Controllers → Services Logic → MongoDB
                         ↓
                    Middleware Layer
        (Auth, Roles, Errors, Rate Limit, Security)
```

### Architectural Decisions
- **Controller separation by domain** keeps business logic modular
- **Central error middleware** avoids duplicated try/catch
- **Async wrapper utility** standardizes async failure handling
- **Validators per resource** isolate request rules
- **Multer config isolation** keeps uploads reusable
- **Database layer separation** improves portability

---

# Tech Stack

## Core
- Node.js
- Express.js
- MongoDB
- Mongoose

## Security
- helmet
- cors
- express-rate-limit
- express-mongo-sanitize
- hpp

## Auth
- jsonwebtoken
- bcryptjs

## Validation & Uploads
- express-validator
- multer

---

# Folder Structure

```bash
shop-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── config/
│   └── db/
├── uploads/
├── app.js
├── server.js
├── .env
└── README.md
```

---

# Setup & Installation

```bash
git clone https://github.com/your-username/shop-api.git
cd shop-api
npm install
```

## Environment Variables

```env
PORT=5000
MONGO_URI=your_connection_string
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

## Run

```bash
npm run dev
```

---

# API Modules

## 1) Authentication
- Register
- Login
- JWT generation
- bcrypt hashing
- role embedding in token

### Example Login Response
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@mail.com",
    "role": "customer"
  }
}
```

---

## 2) Products
### Features
- Create / Read / Update / Delete
- Category filter
- Price range filter
- Pagination
- Sorting by price/name/rating
- Image upload

### Example Queries
```http
GET /products?category=electronics
GET /products?minPrice=100&maxPrice=500
GET /products?page=2&limit=10
GET /products?sortBy=price&sortOrder=asc
```

### Pagination Response Pattern
```json
{
  "total": 120,
  "page": 2,
  "pages": 12,
  "data": []
}
```

---

## 3) Orders
This is the most important backend logic in the project.

## Order Creation Flow
```text
Receive items
→ validate each product
→ check stock
→ calculate total
→ snapshot current price
→ decrement stock
→ save order
→ populate response
```

### Why snapshot price?
Because product prices change.
Orders must preserve **what the customer actually paid**, not the current product price.

### Example Request
```json
{
  "items": [
    { "productId": "abc123", "quantity": 2 }
  ],
  "address": {
    "street": "123 Main",
    "city": "Algiers",
    "country": "Algeria"
  }
}
```

---

## 4) Order Cancellation
Strict business constraints:
- only owner can cancel
- only `pending` orders
- stock restoration required

```text
Find order
→ verify owner
→ verify pending
→ restore stock
→ mark cancelled
```

This prevents inventory corruption.

---

## 5) Reviews
The review system enforces **verified purchase logic**.

### Review Rules
A user can review only if:
- product was purchased
- order status is `delivered`
- user never reviewed same product

### Rating Sync
After add/delete:
```text
Fetch all reviews for product
→ sum ratings
→ divide by count
→ update Product.avgRating
```

This guarantees denormalized consistency.

---

# Security Layer

```js
app.use(helmet())
app.use(cors())
app.use(rateLimiter)
app.use(mongoSanitize())
app.use(hpp())
```

## Threats Covered
- NoSQL injection
- HTTP header vulnerabilities
- request flooding
- parameter pollution
- unsafe cross-origin access

---

# Error Handling Strategy

## AppError Pattern
Custom operational errors:
```js
throw new AppError('Product not found', 404)
```

## Central Middleware
All errors terminate in one place:
```js
app.use(errorMiddleware)
```

Benefits:
- consistent response shape
- no duplicated controller logic
- easier debugging
- better maintainability

---

# Validation Strategy
Validation is separated by domain:
- authValidator
- productValidator
- orderValidator
- reviewValidator

This keeps routes thin and controllers focused on business rules.

---

# Postman Testing Scenarios
Recommended collection folders:
- Auth
- Users
- Products
- Orders
- Reviews
- Security edge cases

Critical test cases:
- invalid JWT
- duplicate email
- stock overflow
- cancel non-pending order
- review without delivery
- duplicate review
- invalid file upload

---

# What I Learned
This project demonstrates strong backend engineering concepts:
- API resource design
- middleware architecture
- transactional-style stock logic
- auth + RBAC
- denormalized data synchronization
- defensive programming
- secure Express configuration
