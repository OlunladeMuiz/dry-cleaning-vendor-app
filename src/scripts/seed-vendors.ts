/**
 * Vendor Seeding Script for CleanU App
 * This script helps you add dry cleaning vendors from Sabo, Lagos, Nigeria
 * 
 * HOW TO USE THIS SCRIPT:
 * 1. Update the Supabase credentials below
 * 2. Add real vendor data to the VENDORS array
 * 3. Run: npx tsx scripts/seed-vendors.ts
 */

interface VendorData {
  name: string;
  description: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  services: {
    name: string;
    price: number;
    description: string;
  }[];
  image: string;
}

// Sabo, Lagos coordinates (approximate center)
// Latitude: 6.5244, Longitude: 3.3792
const SABO_CENTER = {
  lat: 6.5244,
  lng: 3.3792
};

// Sample vendors in Sabo, Lagos area
// REPLACE THESE WITH REAL VENDOR DATA
const VENDORS: VendorData[] = [
  {
    name: "Premium Cleaners Sabo",
    description: "Professional dry cleaning and laundry services with same-day delivery available. Specialists in delicate fabrics and formal wear.",
    address: "12 Sabo Road, Sabo, Yaba, Lagos",
    phone: "+234 803 123 4567",
    latitude: 6.5250,
    longitude: 3.3795,
    services: [
      { name: "Shirt Laundry", price: 800, description: "Professional shirt cleaning and pressing" },
      { name: "Suit Dry Clean", price: 2500, description: "Complete suit dry cleaning" },
      { name: "Dress Dry Clean", price: 2000, description: "Delicate dress cleaning" },
      { name: "Trouser Press", price: 700, description: "Trouser cleaning and pressing" },
      { name: "Bedding (Queen)", price: 3000, description: "Queen size bedding set" },
    ],
    image: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=800"
  },
  {
    name: "Express Dry Cleaners",
    description: "Fast and reliable dry cleaning service. We specialize in corporate wear and offer bulk discounts for students.",
    address: "45 Herbert Macaulay Way, Sabo, Lagos",
    phone: "+234 807 234 5678",
    latitude: 6.5238,
    longitude: 3.3788,
    services: [
      { name: "Shirt (Student Rate)", price: 600, description: "Special student pricing" },
      { name: "Jeans", price: 1000, description: "Denim cleaning" },
      { name: "Jacket", price: 1800, description: "Jacket dry cleaning" },
      { name: "Blazer", price: 2200, description: "Professional blazer cleaning" },
      { name: "Tie/Scarf", price: 500, description: "Accessory cleaning" },
    ],
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800"
  },
  {
    name: "Sparkle Laundry Services",
    description: "Eco-friendly dry cleaning using safe solvents. Perfect for sensitive skin. Pick-up and delivery available around Trinity University area.",
    address: "78 Queens Street, Sabo, Yaba, Lagos",
    phone: "+234 809 345 6789",
    latitude: 6.5255,
    longitude: 3.3800,
    services: [
      { name: "Eco Shirt Clean", price: 900, description: "Environmentally safe cleaning" },
      { name: "Eco Suit Clean", price: 3000, description: "Green dry cleaning for suits" },
      { name: "Delicate Items", price: 1500, description: "Special care items" },
      { name: "Leather Jacket", price: 4000, description: "Professional leather care" },
      { name: "Curtains (per panel)", price: 2500, description: "Curtain cleaning service" },
    ],
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=800"
  },
  {
    name: "QuickClean Sabo",
    description: "Budget-friendly dry cleaning perfect for students. Same location for 10+ years. Trusted by Trinity University students.",
    address: "23 Ajayi Road, Sabo, Lagos",
    phone: "+234 810 456 7890",
    latitude: 6.5242,
    longitude: 3.3785,
    services: [
      { name: "Basic Shirt", price: 500, description: "Budget shirt cleaning" },
      { name: "Basic Trouser", price: 600, description: "Standard trouser service" },
      { name: "Suit (2-piece)", price: 2000, description: "Affordable suit cleaning" },
      { name: "Dress/Skirt", price: 1200, description: "Women's wear cleaning" },
      { name: "Bulk Discount (5+ items)", price: 450, description: "Per item for 5 or more" },
    ],
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800"
  },
  {
    name: "Royal Touch Cleaners",
    description: "Premium dry cleaning service with stain removal expertise. We handle wedding gowns, traditional attire, and formal wear with care.",
    address: "91 Sabo Market Road, Sabo, Lagos",
    phone: "+234 812 567 8901",
    latitude: 6.5248,
    longitude: 3.3798,
    services: [
      { name: "Premium Shirt Service", price: 1200, description: "VIP shirt treatment" },
      { name: "Luxury Suit Clean", price: 3500, description: "Premium suit care" },
      { name: "Wedding Dress", price: 8000, description: "Bridal gown cleaning" },
      { name: "Traditional Attire", price: 3000, description: "Nigerian traditional wear" },
      { name: "Stain Removal", price: 1500, description: "Expert stain treatment" },
    ],
    image: "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=800"
  },
  {
    name: "Campus Cleaners Sabo",
    description: "Student-focused dry cleaning with flexible payment options. Free delivery for Trinity University campus. Open late for student convenience.",
    address: "34 Akoka Road, Near Sabo, Lagos",
    phone: "+234 813 678 9012",
    latitude: 6.5235,
    longitude: 3.3790,
    services: [
      { name: "Student Shirt Special", price: 550, description: "Student ID required" },
      { name: "Campus Suit Clean", price: 1800, description: "Student rate for suits" },
      { name: "Hoodie/Sweater", price: 1000, description: "Casual wear cleaning" },
      { name: "Sneakers Cleaning", price: 1200, description: "Shoe cleaning service" },
      { name: "Weekly Bundle", price: 4000, description: "5 shirts + 2 trousers weekly" },
    ],
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800"
  }
];

// API configuration
const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL"; // e.g., https://xxxxx.supabase.co
const SUPABASE_SERVICE_ROLE_KEY = "YOUR_SERVICE_ROLE_KEY"; // Get from Supabase dashboard
const API_BASE = `${SUPABASE_URL}/functions/v1/make-server-4de27c13`;

async function createVendorAccount(vendor: VendorData) {
  try {
    console.log(`\n📍 Creating vendor account for: ${vendor.name}`);
    
    // 1. Create vendor user account
    const email = vendor.name.toLowerCase().replace(/\s+/g, '') + '@cleanu.local';
    const password = 'VendorPass123!'; // Change this for production
    
    console.log(`   Email: ${email}`);
    
    const signupResponse = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name: vendor.name,
        role: 'vendor',
        phone: vendor.phone,
        address: vendor.address
      })
    });

    const signupData = await signupResponse.json();
    
    if (!signupResponse.ok) {
      console.error(`   ❌ Failed to create account: ${signupData.error}`);
      return null;
    }

    console.log(`   ✅ Account created with ID: ${signupData.user.id}`);

    // 2. Sign in to get access token
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error(`   ❌ Failed to sign in: ${authError.message}`);
      return null;
    }

    // 3. Create vendor profile
    const vendorResponse = await fetch(`${API_BASE}/vendor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.session.access_token}`
      },
      body: JSON.stringify({
        name: vendor.name,
        description: vendor.description,
        address: vendor.address,
        phone: vendor.phone,
        latitude: vendor.latitude,
        longitude: vendor.longitude,
        services: vendor.services,
        image: vendor.image
      })
    });

    const vendorData = await vendorResponse.json();
    
    if (!vendorResponse.ok) {
      console.error(`   ❌ Failed to create vendor profile: ${vendorData.error}`);
      return null;
    }

    console.log(`   ✅ Vendor profile created successfully`);
    console.log(`   📊 Services: ${vendor.services.length} services added`);
    
    return vendorData.vendor;
  } catch (error) {
    console.error(`   ❌ Error creating vendor:`, error);
    return null;
  }
}

async function seedVendors() {
  console.log('🚀 Starting vendor seeding process...\n');
  console.log(`📍 Location: Sabo, Lagos, Nigeria`);
  console.log(`👥 Vendors to create: ${VENDORS.length}\n`);
  console.log('='.repeat(60));

  const results = {
    success: 0,
    failed: 0,
    total: VENDORS.length
  };

  for (const vendor of VENDORS) {
    const result = await createVendorAccount(vendor);
    if (result) {
      results.success++;
    } else {
      results.failed++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SEEDING COMPLETE\n');
  console.log(`✅ Successfully created: ${results.success} vendors`);
  console.log(`❌ Failed: ${results.failed} vendors`);
  console.log(`📍 Total: ${results.total} vendors\n`);
  
  if (results.success > 0) {
    console.log('🎉 Your vendors are now live in the CleanU app!');
    console.log('📱 Students can now discover and order from these vendors.\n');
  }
}

// Run the seeding
if (import.meta.main) {
  seedVendors().catch(console.error);
}

export { seedVendors, VENDORS };
