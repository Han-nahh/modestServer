const { User } = require('../models');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hannatesfaye11@gmail.com',
    pass: 'caza najf gjlq jswt',
  },
});
// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Store hashed token and expiry in user
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    const mailOptions = {
      from: 'hannatesfaye11@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetURL}. This link expires in 1 hour.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, email, newPassword } = req.body;

    // Hash the token to compare with the stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the user by email and valid token
    const user = await User.findOne({
      email,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set the new password in the user model (the hashing will be done in the pre-save hook)
    user.password = newPassword;

    // Clear reset token and expiry
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



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


exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone_number, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Create a new admin user with the OTP as password
    const user = new User({
      name,
      email,
      password: otp, // Set OTP as password
      phone_number,
      role
    });
    await user.save();

    // Send OTP to the user's email
    const mailOptions = {
      from: 'hannatesfaye11@gmail.com',
      to: email,
      subject: 'Your OTP for First-Time Login',
      text: `Your OTP for logging in is: ${otp}. Use this OTP to log in for the first time. Make sure to update your profile under the profile section.`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Error sending OTP email' });
      }
      console.log('OTP email sent:', info.response);
    });

    res.status(201).json({ message: 'Admin created successfully, OTP sent to email', user });

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
    if (user.role !== 'admin' && user.role !== 'superadmin') {
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
    const { password } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10); // Generate salt
      req.body.password = await bcrypt.hash(password, salt); // Hash the password
    }

    console.log(req.body); // Log the updated body for debugging

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
