export interface ProductData {
  title: string;
  bulletPoints: string[];
  description: string;
  productDetails: Record<string, string>;
}

export interface OptimizedContent {
  title: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
}

export interface ProductResponse {
  success: boolean;
  optimizationFailed?: boolean;
  warning?: string;
  data: {
    asin: string;
    original: ProductData;
    optimized: OptimizedContent;
    previousOptimized?: OptimizedContent;
    newOptimized?: OptimizedContent;
  };
}

export interface HistoryItem {
  id: number;
  originalTitle: string;
  originalBulletPoints: string[];
  originalDescription: string;
  productDetails: Record<string, string>;
  optimizedTitle: string;
  optimizedBulletPoints: string[];
  optimizedDescription: string;
  keywords: string[];
  createdAt: string;
}

export interface AsinItem {
  asin: string;
  title: string;
  lastUpdated: string;
  optimizationCount: number;
}