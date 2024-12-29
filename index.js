require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const userRoutes=require('./Routes/userRoute');

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); 
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
  });
  
app.use('/api/user', userRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
