const { Product } = require('../models');
const mongoose = require("mongoose");


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


    if (!image) {
      return res.status(400).json({ error: "Image is required" });
    }

    // Validate `size` field
    if (size) {
      if (!Array.isArray(size)) {
        return res.status(400).json({ error: "Size must be an array of ObjectIds" });
      }

   
    }

    // Validate `color` field
    if (color) {
      if (!Array.isArray(color)) {
        return res.status(400).json({ error: "Color must be an array of ObjectIds" });
      }

    
    }

    // Proceed with saving the product
    const product = new Product({
      name,
      description,
      price,
      discount,
      category,
      stock: stock || 0,
      image,
      discount_start_date,
      discount_end_date,
      size,
      color,
    });

    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

    // Validate and transform `size` to an array of ObjectIds
    if (size) {
      if (!Array.isArray(size)) {
        return res.status(400).json({ error: "Size must be an array of ObjectIds" });
      }
      req.body.size = size.map((s) => {
        if (mongoose.Types.ObjectId.isValid(s)) {
          return s; // Keep valid ObjectId
        } else {
          throw new Error(`Invalid size ObjectId: ${s}`);
        }
      });
    }

    // Validate and transform `color` to an array of ObjectIds
    if (color) {
      if (!Array.isArray(color)) {
        return res.status(400).json({ error: "Color must be an array of ObjectIds" });
      }
      req.body.color = color.map((c) => {
        if (mongoose.Types.ObjectId.isValid(c)) {
          return c; // Keep valid ObjectId
        } else {
          throw new Error(`Invalid color ObjectId: ${c}`);
        }
      });
    }

    // Proceed with the update
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
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
