require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const userRoutes=require('./Routes/userRoute');
const addressRoutes=require('./Routes/addressRoutes');
const categoryRoutes=require('./Routes/categoryRoutes');
const productRoute=require('./Routes/productRoutes');
const orderRoute=require('./Routes/orderRouter');
const paymentRoute=require('./Routes/paymentRouter');
const reviewWishlist=require('./Routes/reviewWishlistRouter');
const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); 
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });
  
app.use('/api/user', userRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products',productRoute);
app.use('/api/orders',orderRoute);
app.use('/api/payment',paymentRoute);
app.use('/api/revwish',reviewWishlist);



// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
