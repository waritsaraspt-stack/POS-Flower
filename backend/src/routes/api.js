const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { getFinancialSummary, addExpense } = require('../controllers/financeController');
const { verifyToken, requireOwner } = require('../middlewares/auth');

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/orders', verifyToken, getOrders);
router.post('/orders', verifyToken, createOrder);
router.patch('/orders/:id/status', verifyToken, updateOrderStatus);

// Strict owner-only routes
router.get('/finance/summary', verifyToken, requireOwner, getFinancialSummary);
router.post('/finance/expenses', verifyToken, requireOwner, addExpense);

module.exports = router;
