export type UserRole = 'student' | 'vendor' | 'agent';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  createdAt: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Service {
  name: string;
  price: number;
  description: string;
  quantity?: number;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  location: Location;
  services: Service[];
  image: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Order {
  id: string;
  studentId: string;
  vendorId: string;
  vendorName?: string;
  services: Service[];
  items: Array<{
    serviceName: string;
    quantity: number;
    price: number;
  }>;
  pickupAddress: string;
  deliveryAddress: string;
  pickupTime: string;
  paymentMethod: string;
  notes: string;
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  totalPrice: number;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  studentId: string;
  vendorId: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}