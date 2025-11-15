# 🏪 Adding Vendors to CleanU App - Sabo, Lagos Guide

This guide shows you how to populate your CleanU marketplace app with dry cleaning vendors from Sabo, Lagos, Nigeria.

## 📋 Table of Contents
1. [Quick Overview](#quick-overview)
2. [Method 1: Using the Seeding Script (Recommended)](#method-1-using-the-seeding-script)
3. [Method 2: Manual Addition via API](#method-2-manual-addition-via-api)
4. [Method 3: Using Supabase Dashboard](#method-3-using-supabase-dashboard)
5. [Finding Real Vendor Data](#finding-real-vendor-data)
6. [Location Coordinates for Sabo](#location-coordinates-for-sabo)

---

## Quick Overview

Your app stores vendors in Supabase and displays them based on:
- **Location**: Latitude/Longitude coordinates
- **Services**: List of services with prices
- **Rating**: Based on customer reviews
- **Distance**: Calculated from student's location

**Sabo, Lagos coordinates**: `6.5244°N, 3.3792°E`

---

## Method 1: Using the Seeding Script (Recommended)

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js
npm install -D tsx
```

### Step 2: Configure the Script

Open `/scripts/seed-vendors.ts` and update:

```typescript
// Update these lines with your Supabase credentials
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key";
```

**Where to find these:**
1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **URL** and **service_role key** (not the anon key)

### Step 3: Add Real Vendor Data

Replace the sample vendors in the `VENDORS` array with real data from Sabo, Lagos:

```typescript
const VENDORS: VendorData[] = [
  {
    name: "Your Actual Vendor Name",
    description: "Real description of the business",
    address: "Actual street address in Sabo, Lagos",
    phone: "+234 XXX XXX XXXX", // Nigerian phone format
    latitude: 6.XXXX,  // Get from Google Maps
    longitude: 3.XXXX, // Get from Google Maps
    services: [
      { 
        name: "Service name", 
        price: 1000, // Price in Naira
        description: "Service description" 
      },
      // Add more services...
    ],
    image: "https://images.unsplash.com/..." // Or real vendor image URL
  },
  // Add more vendors...
];
```

### Step 4: Run the Script
```bash
npx tsx scripts/seed-vendors.ts
```

You should see output like:
```
🚀 Starting vendor seeding process...
📍 Location: Sabo, Lagos, Nigeria
👥 Vendors to create: 6

📍 Creating vendor account for: Premium Cleaners Sabo
   ✅ Account created with ID: xxx
   ✅ Vendor profile created successfully
   📊 Services: 5 services added
...
```

---

## Method 2: Manual Addition via API

### Using Postman or Thunder Client

#### Step 1: Create Vendor Account
**Endpoint**: `POST /signup`
```bash
POST https://your-project.supabase.co/functions/v1/make-server-4de27c13/signup
Content-Type: application/json

{
  "email": "vendor@example.com",
  "password": "SecurePassword123!",
  "name": "Vendor Business Name",
  "role": "vendor",
  "phone": "+234 803 123 4567",
  "address": "12 Sabo Road, Lagos"
}
```

**Response**: You'll get a user ID - save this!

#### Step 2: Sign In
```bash
POST https://your-project.supabase.co/auth/v1/token?grant_type=password
{
  "email": "vendor@example.com",
  "password": "SecurePassword123!"
}
```

**Response**: Save the `access_token`

#### Step 3: Create Vendor Profile
```bash
POST https://your-project.supabase.co/functions/v1/make-server-4de27c13/vendor
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Premium Cleaners Sabo",
  "description": "Professional dry cleaning services",
  "address": "12 Sabo Road, Sabo, Yaba, Lagos",
  "phone": "+234 803 123 4567",
  "latitude": 6.5250,
  "longitude": 3.3795,
  "services": [
    {
      "name": "Shirt Laundry",
      "price": 800,
      "description": "Professional shirt cleaning"
    },
    {
      "name": "Suit Dry Clean",
      "price": 2500,
      "description": "Complete suit dry cleaning"
    }
  ],
  "image": "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800"
}
```

---

## Method 3: Using Supabase Dashboard

### Via SQL Editor

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. **Note**: This method requires you to first understand your KV store structure

Since your app uses a KV (Key-Value) store through the server functions, you'll need to use the API methods above. The KV store doesn't have a direct SQL interface.

---

## Finding Real Vendor Data

### 1. **Google Maps Research**
```
Search: "dry cleaning Sabo Lagos"
```

For each vendor:
- Click on the business
- Get exact coordinates: Right-click → "What's here?"
- Copy phone number and address
- Read reviews for description ideas

### 2. **Get Coordinates from Google Maps**

**Method A - Right Click:**
1. Find the location on Google Maps
2. Right-click on the exact spot
3. Click "What's here?"
4. Coordinates appear at the bottom: `6.5244, 3.3792`

**Method B - From URL:**
1. Open location in Google Maps
2. URL will show: `.../@6.5244,3.3792,...`
3. Format: `latitude, longitude`

### 3. **Create Service Pricing**

Typical dry cleaning prices in Lagos (in Naira):
- Basic shirt: ₦500 - ₦1,000
- Suit (2-piece): ₦2,000 - ₦3,500
- Dress: ₦1,500 - ₦2,500
- Trousers: ₦600 - ₦1,000
- Jacket: ₦1,500 - ₦2,500
- Bedding: ₦2,500 - ₦4,000

**Pro Tip**: Call vendors and ask for their actual price list!

---

## Location Coordinates for Sabo, Lagos

### Key Areas in Sabo:

| Location | Latitude | Longitude |
|----------|----------|-----------|
| Sabo Market | 6.5244 | 3.3792 |
| Herbert Macaulay Way | 6.5238 | 3.3788 |
| Queens Street | 6.5255 | 3.3800 |
| Sabo Bus Stop | 6.5242 | 3.3785 |
| Near Trinity University | 6.5235 | 3.3790 |

### Creating Realistic Vendor Locations:

```typescript
// Vary coordinates slightly for different vendors
// This creates realistic distribution across Sabo

const vendor1 = {
  latitude: 6.5250,  // Slightly north
  longitude: 3.3795, // Slightly east
};

const vendor2 = {
  latitude: 6.5238,  // Slightly south
  longitude: 3.3788, // Slightly west
};
```

**Important**: Keep vendors within Sabo boundaries:
- Latitude range: `6.5230 - 6.5260`
- Longitude range: `6.3780 - 3.3810`

---

## Verification

### Check Vendors are Added:

1. **Via API**:
```bash
GET https://your-project.supabase.co/functions/v1/make-server-4de27c13/vendors
```

2. **In Your App**:
- Open the student home screen
- Vendors should appear in the list
- Try searching by name or location
- Apply filters to test

### Testing Location-Based Display:

The app filters vendors by proximity. To test:
1. Update student location (if needed)
2. Check vendors appear sorted by distance
3. Search for specific vendor names

---

## Troubleshooting

### ❌ "Vendor not showing in app"

**Check:**
1. Vendor was created successfully (check API response)
2. Location coordinates are correct (use Google Maps)
3. Services array is not empty
4. Refresh the student home page

### ❌ "Cannot create vendor"

**Solutions:**
- Verify Supabase credentials are correct
- Check that API_BASE URL is correct
- Ensure you're using the service_role_key (not anon key) for seeding
- Check network connection to Supabase

### ❌ "Coordinates are wrong"

**Fix:**
1. Go to Google Maps
2. Search for the exact address
3. Right-click → "What's here?"
4. Copy the coordinates shown
5. Format: First number = latitude, Second = longitude

---

## Next Steps

After adding vendors:

1. ✅ Test vendor search functionality
2. ✅ Place a test order
3. ✅ Add vendor reviews (optional)
4. ✅ Test filters (price, rating)
5. ✅ Verify vendor dashboard works

---

## Sample Vendor Template

Copy this template for each new vendor:

```typescript
{
  name: "Vendor Business Name",
  description: "Brief description of services and specialties (100-200 characters)",
  address: "Full street address in Sabo, Lagos",
  phone: "+234 8XX XXX XXXX", // Nigerian phone number
  latitude: 6.XXXX,  // From Google Maps
  longitude: 3.XXXX, // From Google Maps
  services: [
    {
      name: "Service Name",
      price: 1000, // In Naira
      description: "What's included in this service"
    },
    // Add 3-8 services per vendor
  ],
  image: "https://images.unsplash.com/photo-XXXXX?w=800" // Or real photo URL
}
```

---

## Resources

- [Google Maps](https://maps.google.com) - Find locations and coordinates
- [Unsplash](https://unsplash.com/s/photos/dry-cleaning) - Free dry cleaning images
- [Supabase Docs](https://supabase.com/docs) - API reference

---

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify Supabase connection in `/utils/supabase/client.ts`
3. Test API endpoints with Postman
4. Check vendor data format matches the `Vendor` interface in `/types/index.ts`

---

**Happy vendor onboarding! 🚀**
