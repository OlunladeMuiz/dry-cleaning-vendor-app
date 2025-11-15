import * as kv from './kv_store.tsx';

// Initialize sample vendors in the database
export async function initializeSampleVendors() {
  try {
    // Check if vendors already exist
    const existingVendors = await kv.getByPrefix('vendor:profile:sample');
    if (existingVendors.length > 0) {
      console.log('Sample vendors already initialized');
      return;
    }

    const sampleVendors = [
      {
        id: 'sample_vendor_1',
        name: 'Trinity Clean & Press',
        description: 'Premium dry cleaning and pressing service with same-day delivery. Specializing in formal wear and delicate fabrics.',
        rating: 4.8,
        reviewCount: 127,
        location: 'Near Trinity Main Gate',
        imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=400',
        services: [
          {
            id: 'service_1_1',
            name: 'Shirt Washing & Ironing',
            price: 40,
            description: 'Professional washing and crisp ironing for shirts'
          },
          {
            id: 'service_1_2',
            name: 'Trouser Pressing',
            price: 50,
            description: 'Expert pressing with perfect creases'
          },
          {
            id: 'service_1_3',
            name: 'Suit Dry Cleaning',
            price: 150,
            description: 'Complete suit cleaning and pressing'
          },
          {
            id: 'service_1_4',
            name: 'Dress Cleaning',
            price: 80,
            description: 'Gentle cleaning for dresses and gowns'
          }
        ]
      },
      {
        id: 'sample_vendor_2',
        name: 'Campus Fresh Laundry',
        description: 'Affordable laundry service for students. Fast turnaround and budget-friendly prices.',
        rating: 4.5,
        reviewCount: 89,
        location: 'University Avenue',
        imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
        services: [
          {
            id: 'service_2_1',
            name: 'Basic Wash & Fold',
            price: 30,
            description: 'Wash, dry and fold service per kg'
          },
          {
            id: 'service_2_2',
            name: 'Express Laundry',
            price: 60,
            description: 'Same-day wash and fold service'
          },
          {
            id: 'service_2_3',
            name: 'Ironing Only',
            price: 25,
            description: 'Professional ironing service per item'
          },
          {
            id: 'service_2_4',
            name: 'Bedding Wash',
            price: 100,
            description: 'Large items like bed sheets and duvets'
          }
        ]
      },
      {
        id: 'sample_vendor_3',
        name: 'SparkleKleen Express',
        description: 'Quick and reliable cleaning service with free pickup and delivery on campus.',
        rating: 4.7,
        reviewCount: 156,
        location: 'Student Housing Area',
        imageUrl: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=400',
        services: [
          {
            id: 'service_3_1',
            name: 'Standard Cleaning',
            price: 35,
            description: 'Regular wash and iron per item'
          },
          {
            id: 'service_3_2',
            name: 'Premium Cleaning',
            price: 70,
            description: 'Deep clean with fabric softener'
          },
          {
            id: 'service_3_3',
            name: 'Stain Removal',
            price: 45,
            description: 'Specialized stain treatment'
          },
          {
            id: 'service_3_4',
            name: 'Shoe Cleaning',
            price: 55,
            description: 'Professional shoe cleaning and polish'
          }
        ]
      },
      {
        id: 'sample_vendor_4',
        name: 'Elite Fabric Care',
        description: 'High-end dry cleaning for premium fabrics. Perfect for interviews and special occasions.',
        rating: 4.9,
        reviewCount: 203,
        location: 'Trinity Campus Center',
        imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400',
        services: [
          {
            id: 'service_4_1',
            name: 'Delicate Fabric Care',
            price: 90,
            description: 'Special care for silk, wool, and delicates'
          },
          {
            id: 'service_4_2',
            name: 'Formal Wear Package',
            price: 200,
            description: 'Complete outfit cleaning and pressing'
          },
          {
            id: 'service_4_3',
            name: 'Quick Press',
            price: 35,
            description: 'Fast pressing for urgent needs'
          },
          {
            id: 'service_4_4',
            name: 'Leather Cleaning',
            price: 120,
            description: 'Professional leather and suede cleaning'
          }
        ]
      }
    ];

    // Store each vendor and their services
    for (const vendor of sampleVendors) {
      await kv.set(`vendor:profile:${vendor.id}`, vendor);
      await kv.set(`vendor:${vendor.id}:services`, vendor.services);
      await kv.set(`vendor:${vendor.id}:orders`, []);
    }

    console.log('Sample vendors initialized successfully');
  } catch (error) {
    console.error('Error initializing sample vendors:', error);
  }
}
