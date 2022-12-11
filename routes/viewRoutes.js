const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get(
  '/',
  orderController.createOrderCheckout,
  authController.isLoggedIn,
  viewController.getOverview
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-orders', authController.protect, viewController.getMyOrders);
router.get(
  '/product_details/:name',
  authController.isLoggedIn,
  viewController.getProductDetails
);

router.get(
  '/all-products',
  authController.protect,
  viewController.getAllProducts
);
router.get('/all-users', authController.protect, viewController.getAllUsers);
router.get('/all-orders', authController.protect, viewController.getAllOrders);

// router.post(
//   '/submit-user-date',
//   authController.protect,
//   viewController.updateUserData
// );

module.exports = router;
