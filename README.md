# Furniture E-Commerce System

A full-stack e-commerce application for buying furniture, built with NestJS backend and NextJS frontend.

## Features

- Browse furniture catalog with filtering
- View furniture details with image zoom
- **Image popup with dimension display**: Hover over edges of furniture images to see dimensions
- Add reviews for products with ratings
- Shopping cart functionality
- Order management and purchase history
- **Recommended furniture**: Based on previous purchases (recommends items from same categories)
- Mock payment flow (payment gateway skipped as requested)

## Tech Stack

- **Backend**: NestJS, TypeORM, PostgreSQL
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: PostgreSQL

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database installed and running
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE furniture_db;
```

2. Enable UUID extension (if not already enabled):
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=furniture_db
PORT=3001
```

5. Start the backend server:
```bash
npm run start:dev
```

The backend will automatically create tables using TypeORM's synchronize feature. The server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` if your backend runs on a different port:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
Furniture/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── furniture/    # Furniture module
│   │   ├── order/        # Order module
│   │   ├── review/       # Review module
│   │   ├── user/         # User module
│   │   └── migrations/    # Database migrations
│   └── package.json
├── frontend/         # Next.js frontend
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   ├── lib/             # API utilities
│   └── package.json
└── README.md
```

## API Endpoints

### Furniture
- `GET /api/furniture` - Get all furniture items
- `GET /api/furniture/:id` - Get furniture details
- `POST /api/furniture` - Create furniture (admin)
- `PUT /api/furniture/:id` - Update furniture (admin)
- `GET /api/furniture/recommended/:userId` - Get recommended furniture

### Orders
- `POST /api/orders` - Create an order
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/user/:userId` - Get user orders

### Reviews
- `POST /api/reviews` - Create a review
- `GET /api/reviews/furniture/:furnitureId` - Get reviews for furniture

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create a user

## Key Features Implementation

### Image Popup with Dimensions
- Click on any furniture image to open a popup
- Hover over the edges (top, bottom, left, right) to see dimensions
- Top/Bottom edges show height
- Left/Right edges show width

### Review System
- Users can rate products (1-5 stars)
- Users can add written comments
- Reviews are displayed on product detail pages

### Recommendation System
- Analyzes user's purchase history
- Recommends furniture from the same categories
- Falls back to popular items if user has no purchase history

## Usage

1. **Browse Furniture**: Visit the home page to see all available furniture
2. **View Details**: Click on any furniture item to see details
3. **Add to Cart**: Click "Add to Cart" on a product page
4. **Review Cart**: Click "Cart" button in header to view cart
5. **Checkout**: Fill in shipping address and click "Proceed to Payment"
6. **Order Success**: View order confirmation page
7. **Add Reviews**: Scroll to reviews section on product page and submit a review

## Default Users

The migration includes sample users:
- User ID: `11111111-1111-1111-1111-111111111111` (John Doe)
- User ID: `22222222-2222-2222-2222-222222222222` (Jane Smith)

## Sample Data

The migration includes sample furniture items:
- Modern Sofa
- Wooden Dining Table
- Ergonomic Office Chair
- King Size Bed Frame
- Coffee Table

## Notes

- Payment gateway integration is skipped as requested
- Cart is stored in browser localStorage
- Default user ID is hardcoded for demo purposes (in production, implement proper authentication)
- All images use Unsplash URLs for demonstration

