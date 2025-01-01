const {User} = require('../models');
const bcrypt = require('bcryptjs'); 


// Create User
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone_number, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ name, email, password, phone_number, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);  // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
  
  };

  // Login User
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if the user's role is "customer"
      if (user.role !== 'customer') {
        return res.status(403).json({ message: 'Access denied: User is not a customer' });
      }
  
      // Optionally, return the user object or generate a token (JWT)
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  exports.loginUserAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Compare entered password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Check if the user's role is "admin"
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: User is not an admin' });
      }
  
      // Optionally, return the user object or generate a token (JWT)
      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Single User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.countCustomers = async (req, res) => {
  try {
    const customerCount = await User.countDocuments({ role: 'customer' });
    res.status(200).json({ customerCount });
  } catch (error) {
    console.error('Error counting customers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
