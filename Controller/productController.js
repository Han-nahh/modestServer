const { Product } = require('../models');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      stock,
      image,
      discount_start_date,
      discount_end_date,
      size,
      color,
    } = req.body;

    // Ensure that stock is provided and is a number
    if (stock && typeof stock !== 'number') {
      return res.status(400).json({ error: 'Stock must be a number' });
    }

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Validate size and color (ensure they are valid ObjectIds)
    if (size && !Array.isArray(size)) {
      return res.status(400).json({ error: 'Size must be an array of ObjectIds' });
    }
    if (color && !Array.isArray(color)) {
      return res.status(400).json({ error: 'Color must be an array of ObjectIds' });
    }

    // Proceed with saving the product
    const product = new Product({
      name,
      description,
      price,
      discount,
      category,
      stock: stock || 0, // Ensure default stock if not provided
      image,
      discount_start_date,
      discount_end_date,
      size,
      color,
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name') // Populate category name
      .populate('size', 'name') // Populate size name
      .populate('color', 'name hexCode'); // Populate color details

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name') // Populate category name
      .populate('size', 'name') // Populate size name
      .populate('color', 'name hexCode'); // Populate color details

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { size, color, stock } = req.body;

    // Validate size and color updates
    if (size && !Array.isArray(size)) {
      return res.status(400).json({ error: 'Size must be an array of ObjectIds' });
    }
    if (color && !Array.isArray(color)) {
      return res.status(400).json({ error: 'Color must be an array of ObjectIds' });
    }

    // Ensure that stock is a number if it's provided
    if (stock && typeof stock !== 'number') {
      return res.status(400).json({ error: 'Stock must be a number' });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Count Products
exports.countProducts = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.status(200).json({ productCount });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
