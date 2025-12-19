import { Request, Response } from 'express';
import pool from '../config/database';
import { ScraperService } from '../services/scraperService';
import geminiService from '../services/geminiService';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ProductController {
  // Optimize a product listing by ASIN
  static async optimizeProduct(req: Request, res: Response) {
    const { asin } = req.body;

    if (!asin) {
      return res.status(400).json({ error: 'ASIN is required' });
    }

    try {
      // Step 1: Scrape product data from Amazon
      console.log(`Scraping product data for ASIN: ${asin}`);
      const productData = await ScraperService.scrapeProduct(asin);

      // Step 2: Optimize with Gemini AI (with fallback)
      let optimizedContent;
      let optimizationFailed = false;
      
      try {
        console.log('Optimizing product listing with Gemini AI...');
        optimizedContent = await geminiService.optimizeProductListing(
          productData.title,
          productData.bulletPoints,
          productData.description,
          productData.productDetails
        );
      } catch (geminiError: any) {
        console.error('Gemini optimization failed:', geminiError.message);
        optimizationFailed = true;
        // Fallback: use original content as "optimized"
        optimizedContent = {
          title: productData.title,
          bulletPoints: productData.bulletPoints,
          description: productData.description,
          keywords: []
        };
      }

      // Step 3: Check if product exists in database
      const [existingProducts] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM products WHERE asin = ?',
        [asin]
      );

      let productId: number;

      if (existingProducts.length > 0) {
        // Update existing product
        productId = existingProducts[0].id;
        await pool.query(
          `UPDATE products SET 
            original_title = ?,
            original_bullet_points = ?,
            original_description = ?,
            product_details = ?,
            optimized_title = ?,
            optimized_bullet_points = ?,
            optimized_description = ?,
            keywords = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            productData.title,
            JSON.stringify(productData.bulletPoints),
            productData.description,
            JSON.stringify(productData.productDetails),
            optimizedContent.title,
            JSON.stringify(optimizedContent.bulletPoints),
            optimizedContent.description,
            JSON.stringify(optimizedContent.keywords),
            productId
          ]
        );
      } else {
        // Insert new product
        const [result] = await pool.query<ResultSetHeader>(
          `INSERT INTO products (
            asin, original_title, original_bullet_points, original_description,
            product_details, optimized_title, optimized_bullet_points,
            optimized_description, keywords
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            asin,
            productData.title,
            JSON.stringify(productData.bulletPoints),
            productData.description,
            JSON.stringify(productData.productDetails),
            optimizedContent.title,
            JSON.stringify(optimizedContent.bulletPoints),
            optimizedContent.description,
            JSON.stringify(optimizedContent.keywords)
          ]
        );
        productId = result.insertId;
      }

      // Step 4: Save to optimization history (only if optimization succeeded)
      if (!optimizationFailed) {
        await pool.query(
          `INSERT INTO optimization_history (
            product_id, 
            original_title, 
            original_bullet_points,
            original_description, 
            product_details,
            optimized_title, 
            optimized_bullet_points,
            optimized_description, 
            keywords
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            productData.title,
            JSON.stringify(productData.bulletPoints),
            productData.description,
            JSON.stringify(productData.productDetails),
            optimizedContent.title,
            JSON.stringify(optimizedContent.bulletPoints),
            optimizedContent.description,
            JSON.stringify(optimizedContent.keywords)
          ]
        );
      }

      // Return response
      res.json({
        success: true,
        optimizationFailed,
        data: {
          asin,
          original: {
            title: productData.title,
            bulletPoints: productData.bulletPoints,
            description: productData.description,
            productDetails: productData.productDetails
          },
          optimized: {
            title: optimizedContent.title,
            bulletPoints: optimizedContent.bulletPoints,
            description: optimizedContent.description,
            keywords: optimizedContent.keywords
          }
        },
        warning: optimizationFailed ? 'AI optimization failed. Showing original content only.' : undefined
      });

    } catch (error: any) {
      console.error('Error optimizing product:', error);
      res.status(500).json({ 
        error: 'Failed to optimize product listing',
        message: error.message 
      });
    }
  }

  // Get optimization history for an ASIN
  static async getHistory(req: Request, res: Response) {
    const { asin } = req.params;

    try {
      // First check if product exists
      const [productRows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM products WHERE asin = ?',
        [asin]
      );

      if (productRows.length === 0) {
        return res.json({ success: true, data: [] });
      }

      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT 
          h.id, 
          h.optimized_title, 
          h.optimized_bullet_points,
          h.optimized_description, 
          h.keywords, 
          h.created_at,
          h.original_title,
          h.original_bullet_points,
          h.original_description,
          h.product_details
         FROM optimization_history h
         JOIN products p ON h.product_id = p.id
         WHERE p.asin = ?
         ORDER BY h.created_at DESC`,
        [asin]
      );

      const history = rows.map(row => {
        let bulletPoints = [];
        let keywords = [];
        let originalBulletPoints = [];
        let productDetails = {};

        // Safely parse optimized bullet points
        try {
          if (row.optimized_bullet_points) {
            if (typeof row.optimized_bullet_points === 'string') {
              bulletPoints = JSON.parse(row.optimized_bullet_points);
            } else {
              bulletPoints = row.optimized_bullet_points;
            }
          }
        } catch (e) {
          console.error('Error parsing bullet points:', e);
          bulletPoints = [];
        }

        // Safely parse keywords
        try {
          if (row.keywords) {
            if (typeof row.keywords === 'string') {
              keywords = JSON.parse(row.keywords);
            } else {
              keywords = row.keywords;
            }
          }
        } catch (e) {
          console.error('Error parsing keywords:', e);
          keywords = [];
        }

        // Safely parse original bullet points
        try {
          if (row.original_bullet_points) {
            if (typeof row.original_bullet_points === 'string') {
              originalBulletPoints = JSON.parse(row.original_bullet_points);
            } else {
              originalBulletPoints = row.original_bullet_points;
            }
          }
        } catch (e) {
          console.error('Error parsing original bullet points:', e);
          originalBulletPoints = [];
        }

        // Safely parse product details
        try {
          if (row.product_details) {
            if (typeof row.product_details === 'string') {
              productDetails = JSON.parse(row.product_details);
            } else {
              productDetails = row.product_details;
            }
          }
        } catch (e) {
          console.error('Error parsing product details:', e);
          productDetails = {};
        }

        return {
          id: row.id,
          originalTitle: row.original_title || '',
          originalBulletPoints: originalBulletPoints,
          originalDescription: row.original_description || '',
          productDetails: productDetails,
          optimizedTitle: row.optimized_title || '',
          optimizedBulletPoints: bulletPoints,
          optimizedDescription: row.optimized_description || '',
          keywords: keywords,
          createdAt: row.created_at
        };
      });

      res.json({ success: true, data: history });
    } catch (error: any) {
      console.error('Error fetching history:', error);
      res.status(500).json({ error: 'Failed to fetch optimization history', message: error.message });
    }
  }

  // Get product by ASIN
  static async getProduct(req: Request, res: Response) {
    const { asin } = req.params;

    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM products WHERE asin = ?',
        [asin]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const product = rows[0];
      
      // Helper function to safely parse JSON
      const safeJsonParse = (value: any, defaultValue: any) => {
        try {
          if (!value) return defaultValue;
          if (typeof value === 'string') {
            return JSON.parse(value);
          }
          return value;
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return defaultValue;
        }
      };

      res.json({
        success: true,
        data: {
          asin: product.asin,
          original: {
            title: product.original_title,
            bulletPoints: safeJsonParse(product.original_bullet_points, []),
            description: product.original_description,
            productDetails: safeJsonParse(product.product_details, {})
          },
          optimized: {
            title: product.optimized_title,
            bulletPoints: safeJsonParse(product.optimized_bullet_points, []),
            description: product.optimized_description,
            keywords: safeJsonParse(product.keywords, [])
          },
          createdAt: product.created_at,
          updatedAt: product.updated_at
        }
      });
    } catch (error: any) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  // Get all ASINs with optimization history
  static async getAllAsins(req: Request, res: Response) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        `SELECT 
          p.asin, 
          p.original_title,
          p.updated_at,
          COUNT(h.id) as optimization_count
         FROM products p
         LEFT JOIN optimization_history h ON p.id = h.product_id
         GROUP BY p.id, p.asin, p.original_title, p.updated_at
         ORDER BY p.updated_at DESC`
      );

      const asins = rows.map(row => ({
        asin: row.asin,
        title: row.original_title,
        lastUpdated: row.updated_at,
        optimizationCount: row.optimization_count
      }));

      res.json({ success: true, data: asins });
    } catch (error: any) {
      console.error('Error fetching ASINs:', error);
      res.status(500).json({ error: 'Failed to fetch ASINs' });
    }
  }

  // Re-optimize from a previous optimization
  static async reOptimize(req: Request, res: Response) {
    const { historyId } = req.body;

    if (!historyId) {
      return res.status(400).json({ error: 'History ID is required' });
    }

    try {
      // Get the previous optimization
      const [historyRows] = await pool.query<RowDataPacket[]>(
        `SELECT 
          h.*, p.asin, p.original_title, p.original_bullet_points,
          p.original_description, p.product_details
         FROM optimization_history h
         JOIN products p ON h.product_id = p.id
         WHERE h.id = ?`,
        [historyId]
      );

      if (historyRows.length === 0) {
        return res.status(404).json({ error: 'History record not found' });
      }

      const historyRecord = historyRows[0];
      const productId = historyRecord.product_id;

      // Helper function to safely parse JSON
      const safeJsonParse = (value: any, defaultValue: any) => {
        try {
          if (!value) return defaultValue;
          if (typeof value === 'string') {
            return JSON.parse(value);
          }
          return value;
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return defaultValue;
        }
      };

      // Parse historical data safely
      const optimizedBulletPoints = safeJsonParse(historyRecord.optimized_bullet_points, []);
      const productDetails = safeJsonParse(historyRecord.product_details, {});
      const historyKeywords = safeJsonParse(historyRecord.keywords, []);
      const originalBulletPoints = safeJsonParse(historyRecord.original_bullet_points, []);

      // Re-optimize using previous optimized content as base
      let newOptimized;
      let optimizationFailed = false;

      try {
        console.log('Re-optimizing from history...');
        newOptimized = await geminiService.optimizeProductListing(
          historyRecord.optimized_title,
          optimizedBulletPoints,
          historyRecord.optimized_description,
          productDetails
        );
      } catch (geminiError: any) {
        console.error('Re-optimization failed:', geminiError.message);
        optimizationFailed = true;
        newOptimized = {
          title: historyRecord.optimized_title,
          bulletPoints: optimizedBulletPoints,
          description: historyRecord.optimized_description,
          keywords: historyKeywords
        };
      }

      // Update product with new optimization
      if (!optimizationFailed) {
        await pool.query(
          `UPDATE products SET 
            optimized_title = ?,
            optimized_bullet_points = ?,
            optimized_description = ?,
            keywords = ?,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
          [
            newOptimized.title,
            JSON.stringify(newOptimized.bulletPoints),
            newOptimized.description,
            JSON.stringify(newOptimized.keywords),
            productId
          ]
        );

        // Save to history
        await pool.query(
          `INSERT INTO optimization_history (
            product_id, 
            original_title, 
            original_bullet_points,
            original_description, 
            product_details,
            optimized_title, 
            optimized_bullet_points,
            optimized_description, 
            keywords
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            historyRecord.optimized_title,
            JSON.stringify(optimizedBulletPoints),
            historyRecord.optimized_description,
            JSON.stringify(productDetails),
            newOptimized.title,
            JSON.stringify(newOptimized.bulletPoints),
            newOptimized.description,
            JSON.stringify(newOptimized.keywords)
          ]
        );
      }

      res.json({
        success: true,
        optimizationFailed,
        data: {
          asin: historyRecord.asin,
          original: {
            title: historyRecord.original_title,
            bulletPoints: originalBulletPoints,
            description: historyRecord.original_description,
            productDetails: productDetails
          },
          previousOptimized: {
            title: historyRecord.optimized_title,
            bulletPoints: optimizedBulletPoints,
            description: historyRecord.optimized_description,
            keywords: historyKeywords
          },
          newOptimized: {
            title: newOptimized.title,
            bulletPoints: newOptimized.bulletPoints,
            description: newOptimized.description,
            keywords: newOptimized.keywords
          }
        },
        warning: optimizationFailed ? 'Re-optimization failed. Using previous version.' : undefined
      });

    } catch (error: any) {
      console.error('Error re-optimizing:', error);
      res.status(500).json({ 
        error: 'Failed to re-optimize',
        message: error.message 
      });
    }
  }
}