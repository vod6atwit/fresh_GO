const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order must belong to a Product'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Order must belong to a User'],
  },
  price: {
    type: Number,
    required: [true, 'Order must have a price'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'product',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
