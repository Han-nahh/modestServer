const {Order} = require('../models');
const {Product} =require('../models');
const {OrderItem} = require('../models');
const {Counter} =require('../models');
const mongoose = require('mongoose');

exports.createOrder = async (req, res) => {
  try {
    const { user, total_price, status, items, shippingInfo } = req.body;
    console.log(req.body); // Log to verify the structure

    // Check if items is an array, if not, wrap it in an array
    const orderItems = Array.isArray(items) ? items : [items];

    // Safely convert total_price to Decimal128
    const totalPriceDecimal = mongoose.Types.Decimal128.fromString(total_price.toString().trim());
    const contactInfo = {
      email: user.email,
      phone: user.phone,
    };

    // Generate invoice_number starting from 10000
    let counter = await Counter.findOne({ name: 'invoice_number' });

    // If counter doesn't exist, create and set it to 9999 (so first increment will be 10000)
    if (!counter) {
      counter = new Counter({ name: 'invoice_number', seq: 9999 });
      await counter.save();
    } else {
      // Increment the counter by 1 for the new invoice number
      counter.seq += 1;
      await counter.save();
    }

    const invoiceNumber = counter.seq;

    // Create order
    const order = new Order({
      user: user.id,
      total_price: totalPriceDecimal,
      status,
      contactInfo,
      shippingInfo,
      invoice_number: `INV-${invoiceNumber}` // Format as "INV-10000", "INV-10001", etc.
    });

    await order.save();

    // Iterate through the items, which is now guaranteed to be an array
    for (let item of orderItems) {
      // Ensure item is valid before destructuring
      if (!item || !item.product || !item.quantity || !item.price) {
        throw new Error('Invalid item structure');
      }

      const { product, quantity, price, color, size } = item;

      // Find product by item.product (which is the product ID)
      const productDoc = await Product.findById(product);
      if (productDoc) {
        productDoc.stock -= quantity; // Subtract the quantity from the product's stock
        if (productDoc.stock < 0) {
          throw new Error(`Not enough stock for product: ${productDoc.name}`);
        }
        await productDoc.save(); // Save the updated product
      } else {
        throw new Error(`Product with ID ${product} not found`);
      }

      const orderItem = new OrderItem({
        order: order._id,
        product,
        quantity,
        price: mongoose.Types.Decimal128.fromString(price.toString().trim()), // Convert price to Decimal128
        color,  // Added color reference
        size,   // Added size reference
      });

      await orderItem.save();
    }

    const savedOrderItems = await OrderItem.find({ order: order._id });
    order.orderItems = savedOrderItems.map(item => item._id);
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error); // Log error message for debugging
    res.status(400).json({ error: error.message });
  }
};


// {
//   "user": "64a7f5c7b9d8f90012d34abc",
//   "total_price": 150.00,           
//   "status": "Pending",             
//   "items": [                        
//     {
//       "product": "64b8c7d2e5f8910011a23xyz", 
//       "quantity": 2,                         
//       "price": 50.00                         
//     },
//     {
//       "product": "64b8d8e3f5g8910021a24uvw",
//       "quantity": 1,
//       "price": 50.00
//     }
//   ]
// }


// Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('orderItems');
    // Ensure populated orderItems contains color and size data
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Orders by User ID
exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ user: userId })
      .populate('user')
      .populate('orderItems');

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate('orderItems');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user').populate('orderItems');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Delete order items associated with the order
    await OrderItem.deleteMany({ order: order._id });

    res.status(200).json({ message: 'Order and related items deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
