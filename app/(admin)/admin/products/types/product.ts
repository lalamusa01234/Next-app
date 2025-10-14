export interface Category {
  _id: string;
  category: string;
}

export interface Variation {
  name: string;
  price: number;
  quantity: number;
  hasDiscount: boolean;
  discountType: string;
  discountValue: number;
  finalPrice?: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  category: Category | string;
  description: string;
  image: string[];
  hasDiscount: boolean;
  discountType: string;
  discountValue: number;
  finalPrice: number;
  variations: Variation[];
}