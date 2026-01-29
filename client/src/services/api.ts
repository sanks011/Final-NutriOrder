import axios from "axios";

/* =========================
   TYPES
========================= */

export interface Restaurant {
  id: string;
  name: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  cholesterol: number;
}

export interface Food {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews?: number;
  reviewCount?: number;
  restaurant: Restaurant;
  nutrition: Nutrition;
  isDiabeticSafe: boolean;
  isVegan: boolean;
  isGlutenFree?: boolean;
  isKeto?: boolean;
  isHeartHealthy?: boolean;
  isLowSodium?: boolean;
  spiceLevel?: string;
  tags?: string[];
  ingredients?: string[];
  recipe?: {
    prepTime: string;
    cookTime: string;
    servings: number;
    instructions: string[];
  };
}

export interface CartItem {
  id?: string;
  food: Food;
  quantity: number;
}

/* =========================
   BASE CONFIG
========================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fiteats_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR (FIXED)
========================= */

// Helper function to normalize MongoDB documents
const normalizeMongoDocument = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeMongoDocument);
  }
  
  const normalized: any = {};
  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue; // Skip inherited properties
    
    if (key === '_id') {
      normalized.id = obj[key];
      normalized._id = obj[key];
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      normalized[key] = normalizeMongoDocument(obj[key]);
    } else {
      normalized[key] = obj[key];
    }
  }
  return normalized;
};

api.interceptors.response.use(
  (response) => {
    // Normalize MongoDB documents in response data
    if (response.data) {
      response.data = normalizeMongoDocument(response.data);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("fiteats_token");
      
      // Only redirect if we actually have a token (failed refresh)
      // or if we're not already on the login page
      if (token && !window.location.pathname.startsWith("/auth")) {
        localStorage.removeItem("fiteats_token");
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

/* =========================
   AUTH API
========================= */

export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post("/auth/register", { name, email, password }),

  logout: () => api.post("/auth/logout"),

  me: () => api.get("/users/me"),
};

/* =========================
   USER / PROFILE
========================= */

export const userAPI = {
  updateProfile: (data: any) => api.put("/users/me", data),

  getPreferences: () => api.get("/users/preferences"),
  savePreferences: (data: any) =>
    api.put("/users/preferences", data),

  getAddresses: () => api.get("/users/addresses"),
  saveAddresses: (data: any[]) =>
    api.put("/users/addresses", data),

  getWishlist: () => api.get("/users/wishlist"),
  addToWishlist: (foodId: string) =>
    api.post("/users/wishlist", { foodId }),
  removeFromWishlist: (foodId: string) =>
    api.delete(`/users/wishlist/${foodId}`),
};

/* =========================
   CART
========================= */

export const cartAPI = {
  get: () => api.get("/cart"),
  update: (items: { food: string; quantity: number }[]) =>
    api.put("/cart", { items }),
  clear: () => api.delete("/cart"),
};

/* =========================
   SUBSCRIPTIONS
========================= */

export interface Subscription {
  id: string;
  _id: string;
  userId: string;
  plan: {
    name: string;
    mealsPerWeek: number;
    discountPercent: number;
    price: number;
  };
  meals: Food[];
  startDate: string;
  status: 'active' | 'paused' | 'cancelled';
  nextDelivery: string;
  totalWeeklyPrice: number;
  savedAmount: number;
}

export const subscriptionAPI = {
  getMySubscriptions: () => api.get("/subscriptions"),
  createSubscription: (data: any) => api.post("/subscriptions", data),
  pauseSubscription: (id: string) => api.put(`/subscriptions/${id}/pause`),
  resumeSubscription: (id: string) => api.put(`/subscriptions/${id}/resume`),
  cancelSubscription: (id: string) => api.delete(`/subscriptions/${id}`),
};

/* =========================
   ORDERS
========================= */

export const orderAPI = {
  create: () => api.post("/orders"),
  getMyOrders: () => api.get("/orders/me"),
  getById: (id: string) => api.get(`/orders/${id}`),
};

/* =========================
   FOOD
========================= */

export const foodAPI = {
  getAll: () => api.get("/foods"),
  getById: (id: string) => api.get(`/foods/${id}`),
};

/* =========================
   REVIEWS
========================= */

export const reviewAPI = {
  getByFood: (foodId: string) =>
    api.get(`/reviews/food/${foodId}`),

  create: (foodId: string, rating: number, comment: string) =>
    api.post("/reviews", { foodId, rating, comment }),
};

export default api;
