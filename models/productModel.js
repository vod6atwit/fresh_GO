const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    validate: [validator.isAlpha, 'A product name only contain characters'],
    trim: true,
  },
  slug: {
    type: String,
  },
  description: {
    type: String,
    required: [true, 'A product must have a description'],
    // trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image'],
  },
});

// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
productSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

// product: name of the collection
// productSchema: schema of the collection
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
