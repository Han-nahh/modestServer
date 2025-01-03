const {Order} = require('../models');
const {OrderItem} = require('../models');
const {Counter} =require('../models');
const mongoose = require('mongoose');
exports.createOrder = async (req, res) => {
  try {
    const { user, total_price, status, items, shippingInfo } = req.body;
    console.log(req.body); // Log to verify the structure

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

    // Create order items
    for (let item of items) {
      const { product, quantity, price } = item;

      const orderItem = new OrderItem({
        order: order._id,
        product,
        quantity,
        price: mongoose.Types.Decimal128.fromString(price.toString().trim()), // Convert price to Decimal128
      });

      await orderItem.save();
    }

    const orderItems = await OrderItem.find({ order: order._id });
    order.orderItems = orderItems.map(item => item._id);
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
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
