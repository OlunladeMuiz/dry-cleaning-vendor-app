# CleanU - Trinity University Dry Cleaning Marketplace

A marketplace app connecting Trinity University students with local dry cleaning vendors through affordable delivery agents.

## Features

### For Students
- 🔍 **Find Vendors**: Browse dry cleaning vendors near campus with ratings and reviews
- 📍 **Location-based**: See vendor distances and filter by location
- 💰 **Price Comparison**: Compare services and prices across vendors
- 📦 **Order Tracking**: Track your order status in real-time
- 👤 **Profile Management**: Manage your profile and view order history
- 💳 **Multiple Payment Options**: Cash, card, or bank transfer

### For Vendors
- 📊 **Dashboard**: View incoming orders and manage your business
- ⚙️ **Service Management**: Add and manage cleaning services and prices
- 📈 **Order Management**: Accept orders and update delivery status
- 💬 **Customer Feedback**: Track ratings and reviews

## Getting Started

### Test Accounts

**Student Account:**
- Email: student@trinity.edu
- Password: student123

**Vendor Account:**
- Email: vendor@trinity.edu
- Password: vendor123

### How to Use

#### As a Student:
1. Sign up or login with your student email
2. Browse available vendors on the home screen
3. Click on a vendor to see their services and prices
4. Select services and provide pickup/delivery details
5. Choose a payment method and confirm your order
6. Track your order status from the order tracking screen

#### As a Vendor:
1. Sign up or login with your business email
2. View incoming orders on your dashboard
3. Add services and set prices
4. Accept orders and update their status
5. Mark orders as delivered when complete

## Sample Vendors

The app comes pre-loaded with 4 sample vendors:

1. **Trinity Clean & Press** - Premium dry cleaning near main gate
2. **Campus Fresh Laundry** - Budget-friendly student laundry service
3. **SparkleKleen Express** - Quick service with free campus delivery
4. **Elite Fabric Care** - High-end cleaning for special occasions

## Technologies Used

- React + TypeScript
- Tailwind CSS
- Supabase (Backend, Auth, Database)
- Hono (Edge Functions Server)
- Shadcn UI Components

## Database Structure

The app uses Supabase's key-value store with the following structure:
- `user:{userId}` - User profile data
- `vendor:profile:{vendorId}` - Vendor business profiles
- `vendor:{vendorId}:services` - Vendor service listings
- `order:{orderId}` - Order details
- `student:{studentId}:orders` - Student order history
- `vendor:{vendorId}:orders` - Vendor order queue
