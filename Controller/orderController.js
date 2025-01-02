const {Order} = require('../models');
const {OrderItem} = require('../models');
const mongoose = require('mongoose');


exports.createOrder = async (req, res) => {
  try {
    const { user, total_price, status, items, shippingInfo } = req.body;
    console.log(req.body); // Log to verify the structure

    // Safely convert total_price and item prices to Decimal128
    const totalPriceDecimal = mongoose.Types.Decimal128.fromString(total_price.toString().trim());
    
    const contactInfo = {
      email: user.email,
      phone: user.phone
    };

    const order = new Order({
      user: user.id,
      total_price: totalPriceDecimal,
      status,
      contactInfo,
      shippingInfo,
    });

    await order.save();

    // Create order items
    for (let item of items) {
      const { product, quantity, price } = item;

      const orderItem = new OrderItem({
        order: order._id,
        product,
        quantity,
        price: mongoose.Types.Decimal128.fromString(price.toString().trim()) // Ensure price is also properly converted
      });

      await orderItem.save();
    }

    const orderItems = await OrderItem.find({ order: order._id });
    order.orderItems = orderItems.map(item => item._id);
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error(error);  // Log error message for debugging
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
