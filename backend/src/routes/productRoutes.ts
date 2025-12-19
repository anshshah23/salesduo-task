import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();

// Optimize product listing
router.post('/optimize', ProductController.optimizeProduct);

// Re-optimize from history
router.post('/reoptimize', ProductController.reOptimize);

// Get all ASINs with history
router.get('/asins', ProductController.getAllAsins);

// Get product by ASIN
router.get('/:asin', ProductController.getProduct);

// Get optimization history for ASIN
router.get('/:asin/history', ProductController.getHistory);

export default router;