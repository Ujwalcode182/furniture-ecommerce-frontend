import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
});

export interface Furniture {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  width: number;
  height: number;
  depth: number;
  category: string;
  inStock: boolean;
  stockQuantity: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  furniture: Furniture;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
}

export const furnitureApi = {
  getAll: () => api.get<Furniture[]>('/api/furniture'),
  getById: (id: string) => api.get<Furniture>(`/api/furniture/${id}`),
  getRecommended: (userId: string) => api.get<Furniture[]>(`/api/furniture/recommended/${userId}`),
};

export const orderApi = {
  create: (data: any) => api.post<Order>('/api/orders', data),
  getById: (id: string) => api.get<Order>(`/api/orders/${id}`),
  getByUser: (userId: string) => api.get<Order[]>(`/api/orders/user/${userId}`),
};

export const reviewApi = {
  create: (data: any) => api.post<Review>('/api/reviews', data),
  getByFurniture: (furnitureId: string) => api.get<Review[]>(`/api/reviews/furniture/${furnitureId}`),
};

export const userApi = {
  getAll: () => api.get<User[]>('/api/users'),
  getById: (id: string) => api.get<User>(`/api/users/${id}`),
  create: (data: any) => api.post<User>('/api/users', data),
};

