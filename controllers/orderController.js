const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Order = require('../models/orderModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const Product = require('../models/productModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // get the currently product
  const product = await Product.findById(req.params.productId);
  // create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: product.price * 100,
          product_data: {
            name: `${product.name}`,
            description: product.description,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/?product=${
      req.params.productId
    }&user=${req.user.id}&price=${product.price}`,
    // success_url: `${req.protocol}://${req.get('host')}/me`,
    cancel_url: `${req.protocol}://${req.get('host')}/`,
  });
  // create session as response
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "default-src 'self' https://*.mapbox.com https://js.stripe.com/v3/;   connect-src 'self' 'unsafe-inline' blob: data: gap: ws: https://*.mapbox.com http://127.0.0.1:8000 https://*.cloudflare.com https://r.stripe.com https://checkout.stripe.com https://api.stripe.com;    base-uri 'self';block-all-mixed-content;    font-src 'self' https: data:;   frame-ancestors 'self';   img-src 'self' data: https://*.stripe.com;    object-src 'none';    script-src 'self' https://js.stripe.com/v3/ https://cdnjs.cloudflare.com https://api.mapbox.com blob: https://r.stripe.com https://js.stripe.com/v3/ https://checkout.stripe.com;   frame-src 'self' https://checkout.stripe.com https://js.stripe.com, https://hooks.stripe.com;img-src https://*.stripe.com;    script-src-attr 'none';   style-src 'self' https: 'unsafe-inline'; upgrade-insecure-requests;"
    )
    .json({
      status: 'success',
      // send back payment session stripe form
      session,
    });
});

exports.createOrderCheckout = catchAsync(async (req, res, next) => {
  // THis is only TEMPORARY, because it's unsecure
  const { product, user, price } = req.query;

  if (!product && !user && !price) return next();

  await Order.create({
    product,
    user,
    price,
  });
  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createOrder = factory.createOne(Order);
exports.getOrder = factory.getOne(Order);
exports.getAllOrder = factory.getAll(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
