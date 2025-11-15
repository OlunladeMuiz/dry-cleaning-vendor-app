import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Prefix all routes
const prefix = '/make-server-4de27c13';

// User signup
app.post(`${prefix}/signup`, async (c) => {
  try {
    const { email, password, name, role, phone, address } = await c.req.json();
    
    if (!email || !password || !name || !role) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (!['student', 'vendor', 'agent'].includes(role)) {
      return c.json({ error: 'Invalid role. Must be student, vendor, or agent' }, 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role, phone, address },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error during signup:', authError);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data
    const userId = authData.user.id;
    await kv.set(`user:${userId}`, {
      id: userId,
      email,
      name,
      role,
      phone: phone || '',
      address: address || '',
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      success: true, 
      user: { id: userId, email, name, role }
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Get user profile
app.get(`${prefix}/user/:userId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user: userData });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({ error: 'Failed to fetch user profile' }, 500);
  }
});

// Update user profile
app.put(`${prefix}/user/:userId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const userId = c.req.param('userId');
    if (user.id !== userId) {
      return c.json({ error: 'Cannot update another user\'s profile' }, 403);
    }

    const updates = await c.req.json();
    const currentData = await kv.get(`user:${userId}`);
    
    if (!currentData) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedData = { ...currentData, ...updates };
    await kv.set(`user:${userId}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Create vendor profile
app.post(`${prefix}/vendor`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, description, address, phone, latitude, longitude, services, image } = await c.req.json();
    
    const vendorId = `vendor:${user.id}`;
    const vendorData = {
      id: user.id,
      name,
      description: description || '',
      address,
      phone,
      location: { latitude, longitude },
      services: services || [],
      image: image || '',
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    await kv.set(vendorId, vendorData);
    await kv.set(`vendor:list:${user.id}`, user.id); // For listing vendors

    return c.json({ success: true, vendor: vendorData });
  } catch (error) {
    console.error('Error creating vendor profile:', error);
    return c.json({ error: 'Failed to create vendor profile' }, 500);
  }
});

// Get all vendors
app.get(`${prefix}/vendors`, async (c) => {
  try {
    const vendors = await kv.getByPrefix('vendor:list:');
    const vendorIds = vendors.map(v => v.value);
    
    const vendorData = await Promise.all(
      vendorIds.map(async (id) => {
        const data = await kv.get(`vendor:${id}`);
        return data;
      })
    );

    return c.json({ vendors: vendorData.filter(v => v !== null) });
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return c.json({ error: 'Failed to fetch vendors' }, 500);
  }
});

// Get single vendor
app.get(`${prefix}/vendor/:vendorId`, async (c) => {
  try {
    const vendorId = c.req.param('vendorId');
    const vendor = await kv.get(`vendor:${vendorId}`);
    
    if (!vendor) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    // Get reviews for this vendor
    const reviews = await kv.getByPrefix(`review:vendor:${vendorId}:`);
    
    return c.json({ 
      vendor, 
      reviews: reviews.map(r => r.value) 
    });
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return c.json({ error: 'Failed to fetch vendor' }, 500);
  }
});

// Update vendor profile
app.put(`${prefix}/vendor/:vendorId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('vendorId');
    if (user.id !== vendorId) {
      return c.json({ error: 'Cannot update another vendor\'s profile' }, 403);
    }

    const updates = await c.req.json();
    const currentData = await kv.get(`vendor:${vendorId}`);
    
    if (!currentData) {
      return c.json({ error: 'Vendor not found' }, 404);
    }

    const updatedData = { ...currentData, ...updates };
    await kv.set(`vendor:${vendorId}`, updatedData);

    return c.json({ success: true, vendor: updatedData });
  } catch (error) {
    console.error('Error updating vendor profile:', error);
    return c.json({ error: 'Failed to update vendor profile' }, 500);
  }
});

// Create order
app.post(`${prefix}/order`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { vendorId, services, pickupAddress, deliveryAddress, pickupTime, paymentMethod, notes } = await c.req.json();
    
    const orderId = `${Date.now()}-${user.id}`;
    const orderData = {
      id: orderId,
      studentId: user.id,
      vendorId,
      services,
      pickupAddress,
      deliveryAddress,
      pickupTime,
      paymentMethod,
      notes: notes || '',
      status: 'pending',
      totalPrice: services.reduce((sum: number, s: any) => sum + (s.price * s.quantity), 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await kv.set(`order:${orderId}`, orderData);
    await kv.set(`order:student:${user.id}:${orderId}`, orderId);
    await kv.set(`order:vendor:${vendorId}:${orderId}`, orderId);

    return c.json({ success: true, order: orderData });
  } catch (error) {
    console.error('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get student orders
app.get(`${prefix}/orders/student/:studentId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const studentId = c.req.param('studentId');
    const orderRefs = await kv.getByPrefix(`order:student:${studentId}:`);
    
    const orders = await Promise.all(
      orderRefs.map(async (ref) => {
        const order = await kv.get(`order:${ref.value}`);
        return order;
      })
    );

    return c.json({ orders: orders.filter(o => o !== null) });
  } catch (error) {
    console.error('Error fetching student orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Get vendor orders
app.get(`${prefix}/orders/vendor/:vendorId`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const vendorId = c.req.param('vendorId');
    const orderRefs = await kv.getByPrefix(`order:vendor:${vendorId}:`);
    
    const orders = await Promise.all(
      orderRefs.map(async (ref) => {
        const order = await kv.get(`order:${ref.value}`);
        return order;
      })
    );

    return c.json({ orders: orders.filter(o => o !== null) });
  } catch (error) {
    console.error('Error fetching vendor orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// Update order status
app.put(`${prefix}/order/:orderId/status`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const orderId = c.req.param('orderId');
    const { status } = await c.req.json();
    
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ error: 'Order not found' }, 404);
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();
    await kv.set(`order:${orderId}`, order);

    return c.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return c.json({ error: 'Failed to update order status' }, 500);
  }
});

// Create review
app.post(`${prefix}/review`, async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { vendorId, orderId, rating, comment } = await c.req.json();
    
    const reviewId = `${Date.now()}-${user.id}`;
    const reviewData = {
      id: reviewId,
      studentId: user.id,
      vendorId,
      orderId,
      rating,
      comment: comment || '',
      createdAt: new Date().toISOString()
    };

    await kv.set(`review:vendor:${vendorId}:${reviewId}`, reviewData);

    // Update vendor rating
    const vendor = await kv.get(`vendor:${vendorId}`);
    if (vendor) {
      const reviews = await kv.getByPrefix(`review:vendor:${vendorId}:`);
      const totalRating = reviews.reduce((sum, r) => sum + r.value.rating, 0);
      vendor.rating = totalRating / reviews.length;
      vendor.reviewCount = reviews.length;
      await kv.set(`vendor:${vendorId}`, vendor);
    }

    return c.json({ success: true, review: reviewData });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ error: 'Failed to create review' }, 500);
  }
});

Deno.serve(app.fetch);
