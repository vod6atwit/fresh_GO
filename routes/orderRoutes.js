const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');

const router = express.Router();

// middleware run in sequence. Protect all routes after this middleware
router.use(authController.protect);

router.get(
  '/checkout-session/:productId',
  authController.protect,
  orderController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'staff'));
router
  .route('/')
  .get(orderController.getAllOrder)
  .post(orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
