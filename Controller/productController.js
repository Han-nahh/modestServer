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
        const { size, color, ...productData } = req.body;
console.log(req.params)
        // Convert the sizes and colors to ObjectId and filter out duplicates
        const uniqueSizes = Array.from(new Set(size)).map(id => new mongoose.Types.ObjectId(id));
        const uniqueColors = Array.from(new Set(color)).map(id => new mongoose.Types.ObjectId(id));

        // Find and update the product, using $addToSet to prevent duplicates
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    name: productData.name,
                    description: productData.description,
                    price: mongoose.Types.Decimal128.fromString(productData.price),
                    discount: mongoose.Types.Decimal128.fromString(productData.discount),
                    category: productData.category,
                    stock: productData.stock,
                    image: productData.image,
                    discount_start_date: productData.discount_start_date,
                    discount_end_date: productData.discount_end_date,
                    link: productData.link
                },
                $addToSet: {
                    size: { $each: uniqueSizes },
                    color: { $each: uniqueColors }
                }
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: 'Server error' });
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
