# 🚀 Quick Start: Adding Vendors to CleanU

## Fastest Way to Add Vendors (3 Steps)

### Option 1: Use the Built-in Onboarding Form (Easiest!)

1. **Add the onboarding tool to your app temporarily:**

Open `/App.tsx` and add this at the top of your component:

```tsx
import { VendorOnboarding } from "./components/VendorOnboarding";

// In your App component, add a state:
const [showVendorOnboarding, setShowVendorOnboarding] = useState(false);

// Add a button somewhere (or just set it to true):
{showVendorOnboarding && <VendorOnboarding onComplete={() => setShowVendorOnboarding(false)} />}
```

2. **Open the form in your browser**

3. **Fill in vendor details and click "Create Vendor Account"**

Done! The vendor is now live. ✅

---

### Option 2: Quick API Test (Using Browser Console)

1. **Open your app in the browser**
2. **Open Developer Console (F12)**
3. **Paste this code:**

```javascript
async function addVendor() {
  const API_BASE = "https://your-project.supabase.co/functions/v1/make-server-4de27c13";
  
  // Step 1: Create account
  const signup = await fetch(`${API_BASE}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: "premiumcleaners@test.com",
      password: "Password123!",
      name: "Premium Cleaners Sabo",
      role: "vendor",
      phone: "+234 803 123 4567",
      address: "12 Sabo Road, Sabo, Yaba, Lagos"
    })
  });
  
  const signupData = await signup.json();
  console.log("Signup:", signupData);
  
  // Step 2: Sign in (using Supabase client)
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: "premiumcleaners@test.com",
    password: "Password123!"
  });
  
  // Step 3: Create vendor profile
  const vendor = await fetch(`${API_BASE}/vendor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authData.session.access_token}`
    },
    body: JSON.stringify({
      name: "Premium Cleaners Sabo",
      description: "Professional dry cleaning services",
      address: "12 Sabo Road, Sabo, Yaba, Lagos",
      phone: "+234 803 123 4567",
      latitude: 6.5250,
      longitude: 3.3795,
      services: [
        {
          name: "Shirt Laundry",
          price: 800,
          description: "Professional shirt cleaning"
        },
        {
          name: "Suit Dry Clean",
          price: 2500,
          description: "Complete suit cleaning"
        }
      ],
      image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800"
    })
  });
  
  const vendorData = await vendor.json();
  console.log("Vendor created:", vendorData);
}

// Run it!
addVendor();
```

4. **Check the console for success message**
5. **Refresh your app to see the new vendor**

---

## Sample Vendors for Sabo, Lagos

Copy-paste these into your onboarding form or script:

### Vendor 1: Premium Cleaners Sabo
- **Email**: premiumcleaners@cleanu.local
- **Password**: Vendor123!
- **Name**: Premium Cleaners Sabo
- **Description**: Professional dry cleaning and laundry services with same-day delivery
- **Address**: 12 Sabo Road, Sabo, Yaba, Lagos
- **Phone**: +234 803 123 4567
- **Latitude**: 6.5250
- **Longitude**: 3.3795
- **Services**:
  - Shirt Laundry - ₦800
  - Suit Dry Clean - ₦2,500
  - Dress Dry Clean - ₦2,000
  - Trouser Press - ₦700

### Vendor 2: Express Dry Cleaners
- **Email**: expresscleaners@cleanu.local
- **Password**: Vendor123!
- **Name**: Express Dry Cleaners
- **Description**: Fast and reliable dry cleaning service with student discounts
- **Address**: 45 Herbert Macaulay Way, Sabo, Lagos
- **Phone**: +234 807 234 5678
- **Latitude**: 6.5238
- **Longitude**: 3.3788
- **Services**:
  - Shirt (Student Rate) - ₦600
  - Jeans - ₦1,000
  - Jacket - ₦1,800
  - Blazer - ₦2,200

### Vendor 3: QuickClean Sabo
- **Email**: quickclean@cleanu.local
- **Password**: Vendor123!
- **Name**: QuickClean Sabo
- **Description**: Budget-friendly dry cleaning perfect for students
- **Address**: 23 Ajayi Road, Sabo, Lagos
- **Phone**: +234 810 456 7890
- **Latitude**: 6.5242
- **Longitude**: 3.3785
- **Services**:
  - Basic Shirt - ₦500
  - Basic Trouser - ₦600
  - Suit (2-piece) - ₦2,000
  - Bulk Discount (5+ items) - ₦450 per item

---

## Verify Vendors Were Added

### Method 1: Check in App
1. Open your CleanU app
2. Sign in as a student
3. Go to Student Home
4. You should see the vendors listed!

### Method 2: Check via API
```javascript
// In browser console:
fetch('https://your-project.supabase.co/functions/v1/make-server-4de27c13/vendors')
  .then(r => r.json())
  .then(data => console.log('Vendors:', data));
```

---

## Common Issues & Fixes

### ❌ "Email already exists"
**Solution**: The vendor already exists. Try a different email or delete the existing one.

### ❌ "Vendor not showing in app"
**Solution**: 
1. Refresh the page
2. Check browser console for errors
3. Verify the vendor was created (use API check above)

### ❌ "Cannot read coordinates"
**Solution**: Make sure latitude and longitude are numbers, not strings:
- Correct: `6.5244`
- Wrong: `"6.5244"`

---

## Next Steps

After adding a few vendors:

1. ✅ **Test as student**: Browse vendors, view details
2. ✅ **Place test order**: Complete the full flow
3. ✅ **Test as vendor**: Sign in with vendor credentials, view dashboard
4. ✅ **Add more vendors**: Keep adding until you have good coverage of Sabo area

---

## Pro Tips

💡 **Finding Real Vendors**:
- Google Maps: Search "dry cleaning Sabo Lagos"
- Get phone numbers from business listings
- Right-click location → "What's here?" for coordinates

💡 **Realistic Pricing** (Lagos):
- Student-friendly: ₦500-800 per shirt
- Mid-range: ₦800-1,200 per shirt  
- Premium: ₦1,200+ per shirt

💡 **Service Variety**:
Add 4-8 services per vendor:
- Shirts, Suits, Dresses, Trousers
- Jackets, Jeans, Traditional wear
- Bedding, Curtains, Sneakers

---

Need help? Check `/VENDOR_SETUP_GUIDE.md` for detailed instructions!
