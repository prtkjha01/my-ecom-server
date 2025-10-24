import { Types } from "mongoose";

// Product related types
export interface CreateProductRequest {
  product_name: string;
  brand: string;
  category:
    | "CLOTHING"
    | "ELECTRONICS"
    | "STATIONARY"
    | "FITNESS"
    | "PERSONAL_CARE";
  images: string[];
  currency_symbol?: string;
  price: number;
  discount?: number;
  rating: number;
  description?: string;
  specifications?: string[];
  is_assured?: boolean;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

// Order related types
export interface CreateOrderRequest {
  amount: number;
}

export interface PaymentSuccessRequest {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Address related types
export interface CreateAddressRequest {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default?: boolean;
}

// Review related types
export interface CreateReviewRequest {
  rating: number;
  image?: string;
  title?: string;
  body?: string;
}

// Cart related types
export interface AddToCartRequest {
  product: Types.ObjectId;
  count: number;
}

// User related types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface SubscribeNewsletterRequest {
  email: string;
}
