const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // Import bcryptjs

// userSchema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  email: { type: String, unique: true, required: true, maxlength: 100 },
  password: { type: String, required: true, maxlength: 255 },
  phone_number: { type: String, maxlength: 15 },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
}, { timestamps: true });

// Hash the password before saving the user document
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash password
    next(); // Proceed with saving the user
  } catch (error) {
    next(error); // Handle any error
  }
});
const User = mongoose.model('User', userSchema);


// Address Schema
const addressSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    address_line1: { type: String, required: true, maxlength: 255 },
    address_line2: { type: String, maxlength: 255 },
    city: { type: String, required: true, maxlength: 100 },
    state: { type: String, maxlength: 100 },
    country: { type: String, required: true, maxlength: 100 },
    postal_code: { type: String, maxlength: 20 },
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

// Main Categories Schema
const mainCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
}, { timestamps: true });

const MainCategory = mongoose.model('MainCategory', mainCategorySchema);

// Subcategories Schema
const subcategorySchema = new mongoose.Schema({
    main_category: { type: mongoose.Schema.Types.ObjectId, ref: 'MainCategory', required: true },
    name: { type: String, required: true, maxlength: 100 },
}, { timestamps: true });

const Subcategory = mongoose.model('Subcategory', subcategorySchema);

// Products Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    price: { type: mongoose.Types.Decimal128, required: true },
    discount: { type: mongoose.Types.Decimal128, default: 0.00 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    stock: { type: Number, default: 0 },
    image_url: { type: String, maxlength: 255 },
    discount_start_date: { type: Date },
    discount_end_date: { type: Date },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// Orders Schema
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_price: { type: mongoose.Types.Decimal128, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Order Items Schema
const orderItemSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: mongoose.Types.Decimal128, required: true },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// Payment Schema
const paymentSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_method: { type: String, enum: ['card', 'cash_on_delivery'], required: true },
    payment_status: { type: String, enum: ['paid', 'failed', 'refunded'], default: 'paid' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

// Reviews Schema
const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = {
    User,
    Address,
    MainCategory,
    Subcategory,
    Product,
    Order,
    OrderItem,
    Payment,
    Review,
    Wishlist,
};
