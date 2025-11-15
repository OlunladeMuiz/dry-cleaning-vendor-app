# 🏪 How to Add Vendors to Your CleanU App

Your app now has a built-in **Admin Panel** to add vendors from Sabo, Lagos easily!

## 🚀 Quick Access Methods

### **Method 1: Purple Button (Easiest)**
Look for the **purple floating button** in the bottom-right corner of any screen. Click it to open the admin panel.

### **Method 2: Keyboard Shortcut**
Press `Ctrl + Shift + V` anywhere in the app to toggle the admin panel.

### **Method 3: Welcome Screen**
On the welcome screen, click the **"Add Vendors (Admin)"** button.

---

## 📝 How to Use the Admin Panel

When you open the admin panel, you'll see two tabs:

### **Tab 1: Add Vendor Form**
Fill in the form with vendor details:

1. **Account Information**
   - Email (e.g., `vendor@example.com`)
   - Password (min 6 characters)

2. **Business Information**
   - Business name
   - Description
   - Phone number
   - Address in Sabo, Lagos
   - Image URL (optional - uses default if empty)

3. **Location**
   - Latitude and Longitude
   - Use "Use Current Location" button OR
   - Get coordinates from Google Maps (see below)

4. **Services & Pricing**
   - Add multiple services
   - Set prices in Naira (₦)
   - Add descriptions

5. Click **"Create Vendor Account"**

✅ Done! The vendor is now live in your app.

---

### **Tab 2: Sample Data**
This tab shows **3 ready-to-use sample vendors** from Sabo, Lagos with:
- Pre-filled email and password
- Realistic addresses and coordinates
- Phone numbers
- Suggested services

Just **copy the information** and paste it into the form!

---

## 📍 How to Get Coordinates from Google Maps

1. Open [Google Maps](https://maps.google.com)
2. Search for the vendor's address in Sabo, Lagos
3. **Right-click** on the exact location
4. Click **"What's here?"**
5. The coordinates appear at the bottom (e.g., `6.5244, 3.3792`)
6. First number = **Latitude**, Second number = **Longitude**

### Sabo, Lagos Reference Coordinates:
- **Center of Sabo**: Lat `6.5244`, Lng `3.3792`
- **Sabo Market**: Lat `6.5244`, Lng `3.3792`
- **Herbert Macaulay Way**: Lat `6.5238`, Lng `3.3788`

---

## 💰 Typical Dry Cleaning Prices (Lagos)

Use these as reference for service pricing:

| Service | Budget | Mid-Range | Premium |
|---------|--------|-----------|---------|
| Shirt | ₦500-700 | ₦800-1,000 | ₦1,200+ |
| Suit (2-piece) | ₦1,800-2,200 | ₦2,500-3,000 | ₦3,500+ |
| Dress | ₦1,500-1,800 | ₦2,000-2,500 | ₦3,000+ |
| Trousers | ₦600-800 | ₦1,000-1,200 | ₦1,500+ |
| Jeans | ₦800-1,000 | ₦1,200-1,500 | ₦1,800+ |

---

## 🎯 Quick Start - Add Your First Vendor

1. Click the **purple + button** (bottom-right)
2. Go to **"Sample Data"** tab
3. Copy details from **Premium Cleaners Sabo**:
   - Email: `premiumcleaners@cleanu.local`
   - Password: `Vendor123!`
4. Switch to **"Add Vendor Form"** tab
5. Paste the info and add services:
   - Shirt Laundry - ₦800
   - Suit Dry Clean - ₦2,500
   - Dress - ₦2,000
6. Click **"Create Vendor Account"**

That's it! You've added your first vendor. 🎉

---

## ✅ Verify Vendors Were Added

After adding vendors:

1. Close the admin panel
2. Go to the Student Home (sign in as a student)
3. You should see the vendors listed!
4. Click on a vendor to see details
5. Try placing a test order

---

## 🔐 Sign In as a Vendor

After creating a vendor, you can sign in as that vendor:

1. Go to the auth screen
2. Select **"Vendor"** role
3. Use the vendor's email and password
4. You'll see the vendor dashboard!

---

## 🛠️ Troubleshooting

### Vendor not showing?
- Refresh the page
- Check browser console for errors
- Make sure all required fields were filled

### Can't find coordinates?
- Use Google Maps "What's here?" feature
- Make sure format is: `6.XXXX` (latitude), `3.XXXX` (longitude)
- Sabo area is around: Lat 6.52-6.53, Lng 3.37-3.38

### "Email already exists" error?
- This email was already used
- Try a different email address
- Or you can sign in as that vendor

---

## 📚 Additional Resources

- **Full Guide**: See `/VENDOR_SETUP_GUIDE.md` for detailed instructions
- **Quick Start**: See `/QUICK_START.md` for fastest methods
- **Seeding Script**: See `/scripts/seed-vendors.ts` for bulk adding

---

## 🎨 Customization

Want to remove the admin panel later?

1. Open `/App.tsx`
2. Remove or comment out the floating purple button
3. Remove the `onAdminAccess` prop from WelcomeScreen
4. The keyboard shortcut (`Ctrl+Shift+V`) will still work

---

**Happy vendor onboarding! 🚀**

Your CleanU marketplace is ready to connect Trinity University students with dry cleaners in Sabo, Lagos!
