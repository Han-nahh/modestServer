const {Product}=require('../models');



// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, stock,image, discount_start_date, discount_end_date, size, color } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }

    // Proceed with saving the product if the image is available
    const product = new Product({
      name,
      description,
      price,
      discount,
      category,
      stock,
      image,  // Store the image buffer here
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
    const products = await Product.find().populate('category');
    
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Assuming you're storing the image URL or converting the buffer to a URL
    const productData = {
      ...product._doc,
      imageUrl: product.image ? `/path/to/images/${product._id}.jpg` : null, // Provide the correct image path or URL
    };

    res.status(200).json(productData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body)
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

exports.countProducts = async (req, res) => {
  try {
    const productCount = await Product.countDocuments(); // Adjust model as needed
    res.status(200).json({ productCount });
  } catch (error) {
    console.error('Error counting products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};