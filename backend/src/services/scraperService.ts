import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ProductData {
  title: string;
  bulletPoints: string[];
  description: string;
  productDetails: Record<string, string>;
}

export class ScraperService {
  private static readonly HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  };

  static async scrapeProduct(asin: string): Promise<ProductData> {
    try {
      const url = `https://www.amazon.in/dp/${asin}`;
      const response = await axios.get(url, { 
        headers: this.HEADERS,
        timeout: 10000 
      });

      const $ = cheerio.load(response.data);

      // Extract title
      const title = $('#productTitle').text().trim() || 
                   $('#title .product-title-word-break').text().trim() ||
                   'Title not found';

      // Extract bullet points from "About this item" section
      const bulletPoints: string[] = [];
      
      // Try the main selector for bullet points
      $('ul.a-unordered-list.a-vertical.a-spacing-small li span.a-list-item').each((_, element) => {
        const text = $(element).text().trim();
        if (text && !text.includes('See more product details')) {
          bulletPoints.push(text);
        }
      });
      
      // Fallback: Try without spacing class
      if (bulletPoints.length === 0) {
        $('ul.a-unordered-list.a-vertical li span.a-list-item').each((_, element) => {
          const text = $(element).text().trim();
          if (text && !text.includes('See more product details')) {
            bulletPoints.push(text);
          }
        });
      }
      
      // Fallback: Try feature-bullets section
      if (bulletPoints.length === 0) {
        $('#feature-bullets ul li span.a-list-item').each((_, element) => {
          const text = $(element).text().trim();
          if (text && !text.includes('See more product details')) {
            bulletPoints.push(text);
          }
        });
      }

      // Extract product details from multiple sections
      const productDetails: Record<string, string> = {};
      
      // Try product-facts-detail class
      $('.product-facts-detail').each((_, element) => {
        const key = $(element).find('.a-col-left .a-color-base').text().trim();
        const value = $(element).find('.a-col-right .a-color-base').text().trim();
        if (key && value) {
          productDetails[key] = value;
        }
      });
      
      // Also try the detail bullets section
      $('#detailBullets_feature_div ul li').each((_, element) => {
        const fullText = $(element).text().trim();
        const parts = fullText.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim().replace(/\s+/g, ' ');
          const value = parts.slice(1).join(':').trim();
          if (key && value) {
            productDetails[key] = value;
          }
        }
      });
      
      // Try product details table
      $('#productDetails_detailBullets_sections1 tr').each((_, element) => {
        const key = $(element).find('th').text().trim();
        const value = $(element).find('td').text().trim();
        if (key && value) {
          productDetails[key] = value;
        }
      });

      // Extract description (from product description section)
      let description = $('#productDescription p').text().trim();
      if (!description) {
        description = $('#productDescription').text().trim();
      }
      if (!description) {
        description = $('.a-section.a-spacing-small').text().trim();
      }
      if (!description) {
        description = 'Description not available';
      }

      return {
        title,
        bulletPoints,
        description: description.substring(0, 500), // Limit description length
        productDetails,
      };
    } catch (error: any) {
      console.error(`Error scraping ASIN ${asin}:`, error.message);
      throw new Error(`Failed to scrape product data for ASIN: ${asin}`);
    }
  }
}
