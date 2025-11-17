import express from 'express';
import { createOrder, getUserOrders, getOrderById, getAllOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getUserOrders);
router.get('/all', authenticate, getAllOrders); // For future admin use
router.get('/:id', authenticate, getOrderById);

export default router;
