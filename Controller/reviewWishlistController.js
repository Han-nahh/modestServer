const {Review} = require('../models');
const {Wishlist} = require('../models');
const {Product} = require('../models');
const {User} = require('../models');

// ** Reviews Controller **

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { user, product, rating, comment } = req.body;

    // Check if the product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = new Review({
      user,
      product,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Reviews for a Product
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate('user product');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ** Wishlist Controller **

// Add Product to Wishlist
exports.addToWishlist = async (req, res) => {
  console.log(req.body)
  try {
    const { user, product } = req.body;

    // Check if the product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const wishlistItem = new Wishlist({
      user,
      product,
    });

    await wishlistItem.save();

    res.status(201).json({ message: 'Product added to wishlist successfully', wishlistItem });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get All Wishlist for a Specific User or All Users
exports.getAllWishlist = async (req, res) => {
  try {
    const { userId } = req.params;  // Get the userId from the URL params

    let wishlistItems;

    if (userId === "all") {
      // Fetch all wishlist items for all users
      wishlistItems = await Wishlist.find().populate('user').populate('product');
    } else {
      // Fetch wishlist for a specific user
      wishlistItems = await Wishlist.find({ user: userId }).populate('product');
    }

    if (wishlistItems.length === 0) {
      return res.status(404).json({ message: 'No wishlist items found' });
    }

    res.status(200).json({ message: 'Wishlist fetched successfully', wishlistItems });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get All Wishlist Items for a User
exports.getUserWishlist = async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.params.userId }).populate('product');
    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove Product from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByIdAndDelete(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    res.status(200).json({ message: 'Product removed from wishlist successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
