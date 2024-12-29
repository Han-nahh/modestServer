const {Payment} = require('../models');
const {Order} = require('../models');

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { order, payment_method, payment_status } = req.body;

    // Check if order exists
    const orderExists = await Order.findById(order);
    if (!orderExists) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = new Payment({
      order,
      payment_method,
      payment_status
    });

    await payment.save();

    res.status(201).json({ message: 'Payment created successfully', payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('order');
    res.status(200).json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single Payment
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('order');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Payment
exports.updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
