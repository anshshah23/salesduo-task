import axios from 'axios';
import { ProductResponse } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  async optimizeProduct(asin: string): Promise<ProductResponse> {
    const response = await axios.post<ProductResponse>(`${API_BASE_URL}/products/optimize`, { asin });
    return response.data;
  },

  async getProduct(asin: string): Promise<ProductResponse> {
    const response = await axios.get<ProductResponse>(`${API_BASE_URL}/products/${asin}`);
    return response.data;
  },

  async getHistory(asin: string) {
    const response = await axios.get(`${API_BASE_URL}/products/${asin}/history`);
    return response.data;
  },

  async getAllAsins() {
    const response = await axios.get(`${API_BASE_URL}/products/asins`);
    return response.data;
  },

  async reOptimize(historyId: number) {
    const response = await axios.post(`${API_BASE_URL}/products/reoptimize`, { historyId });
    return response.data;
  }
};