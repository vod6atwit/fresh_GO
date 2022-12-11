const Product = require('../models/productModel');
const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orderModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get product data from collection
  const products = await Product.find();

  // render template using product data
  res.status(200).render('overview', {
    title: 'All Products', // set default title
    // pass products to overview template
    products,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up new account',
  });
};

exports.getAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
};

exports.getProductDetails = catchAsync(async (req, res, next) => {
  // find all bookings with user
  const product = await Product.findOne({ name: req.params.name });

  if (!product) {
    return next(new AppError('There is no product with that name.', 404));
  }

  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;connect-src self 'unsafe-inline' blob: data: gap: ws: https://*.mapbox.com http://127.0.0.1:8000 https://*.cloudflare.com https://js.stripe.com/v3/;base-uri 'self';block-all-mixed-content; font-src 'self' https: data:; frame-ancestors 'self';img-src 'self' data:; object-src 'none'; script-src https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ; script-src-attr 'none'; style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    )
    .render('product_details', {
      title: `${product.name}`,
      product,
    });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
  // find all bookings with user
  const orders = await Order.find({
    user: req.user.id,
  });
  // find all tourID with the returned user IDs
  const productIDs = orders.map((el) => el.product);
  // find all tours with the returned tourID
  const products = await Product.find({
    _id: { $in: productIDs },
  });
  res.status(200).render('product', {
    title: 'My Products',
    products,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // find all products with user
  const products = await Product.find();

  res.status(200).render('product', {
    title: 'All Products',
    products,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  // find all bookings with user
  const users = await User.find();

  res.status(200).render('user', {
    title: 'All Users',
    users,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  // find all Order with user
  const orders = await Order.find();

  res.status(200).render('manageOrders', {
    title: 'All Orders',
    orders,
  });
});

// exports.updateUserData = catchAsync(async (req, res, next) => {
//   // console.log(req.body);
//   const updateUser = await User.findByIdAndUpdate(
//     req.user.id,
//     {
//       name: req.body.name,
//       email: req.body.email,
//     },
//     {
//       new: true,
//       runValidations: true,
//     }
//   );

//   res.status(200).render('account', {
//     title: 'Your account',
//     user: updateUser,
//   });
// });
