export interface Product {
  id: number;
  asin: string;
  originalTitle: string;
  optimizedTitle: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface OptimizeRequest {
  asin: string;
  originalTitle: string;
  description: string;
  bulletPoints: string[];
}