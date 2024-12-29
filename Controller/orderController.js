const {Order} = require('../models');
const {OrderItem} = require('../models');

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { user, total_price, status, items } = req.body;

    const order = new Order({
      user,
      total_price,
      status
    });

    await order.save();

    // Create order items
    for (let item of items) {
      const { product, quantity, price } = item;
      const orderItem = new OrderItem({
        order: order._id,
        product,
        quantity,
        price
      });

      await orderItem.save();
    }

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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
