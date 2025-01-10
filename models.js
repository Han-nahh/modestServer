const mongoose = require('mongoose');

const bcrypt = require('bcryptjs'); // Import bcryptjs

const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, maxlength: 100 },
      email: { type: String, unique: true, required: true, maxlength: 100 },
      password: { type: String, maxlength: 255 },
      phone_number: { type: String, maxlength: 35 },
      role: { type: String, enum: ['admin', 'customer', 'superadmin'] },
      resetPasswordToken: { type: String }, // Added for password reset token
      resetPasswordExpires: { type: Date }, // Added for token expiration
    },
    { timestamps: true }
  );
  
  // Pre-save hook for hashing the password
  userSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
      try {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
      } catch (error) {
        return next(error); // Handle any error
      }
    }
    next(); // Proceed with saving the user
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

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }, // Color name (e.g., Red, Blue, Green)
    hexCode: { type: String, required: false, maxlength: 7 }, // Optional HEX code (e.g., #FFFFFF)
}, { timestamps: true });

const Color = mongoose.model('Color', colorSchema);

// Size Schema
const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 }, // Size name (e.g., Small, Medium, Large)
    description: { type: String, required: false, maxlength: 200 }, // Optional description (e.g., "For children" or "Waist 32-34")
}, { timestamps: true });

const Size = mongoose.model('Size', sizeSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String },
    price: { type: mongoose.Types.Decimal128, required: true },
    discount: { type: mongoose.Types.Decimal128, default: 0.00 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
    stock: { type: Number, default: 0 },  
    image: { type: String }, 
    discount_start_date: { type: Date },
    discount_end_date: { type: Date },
    link: { type: String, default: "/product/detail" },
    size: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }], default: null }, 
    color: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }], default: null },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);


const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, required: true },
  });
  
  const Counter = mongoose.model('Counter', counterSchema);
const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    total_price: { type: mongoose.Types.Decimal128, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'OrderItem',
        color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color', default: null }, 
        size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size', default: null },    
    }],
    contactInfo: {
        email: { type: String, required: true },
        phone: { type: String, required: true },
    },
    shippingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
    },
    invoice_number: { type: String, required: true }, 
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);


// Order Items Schema
const OrderItemSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number },
  price: { type: mongoose.Schema.Types.Decimal128 },
  color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },  // Reference to a Color document
  size: { type: mongoose.Schema.Types.ObjectId, ref: 'Size' },  // Reference to a Size document
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
    Counter,
    Color,
    Size
};
