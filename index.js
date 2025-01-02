require("dotenv").config(); // Load environment variables
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const axios = require('axios')
const userRoutes = require('./Routes/userRoute');
const addressRoutes = require('./Routes/addressRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const productRoute = require('./Routes/productRoutes');
const orderRoute = require('./Routes/orderRouter');
const paymentRoute = require('./Routes/paymentRouter');
const reviewWishlist = require('./Routes/reviewWishlistRouter');
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
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/revwish', reviewWishlist);



// Connect to MongoDB
connectDB();

const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";
const CHAPA_AUTH = 'CHASECK_TEST-QBCagQ9BxP4sDK0BBDTM57vdLj1bRkzr';

app.set("view engine", "ejs");

// Configure headers for API requests
const config = {
  headers: {
    Authorization: `Bearer ${CHAPA_AUTH}`
  }
};

// Payment configuration
const paymentConfig = {
  CALLBACK_URL: "https://modestserver.onrender.com/api/verify-payment/",
  RETURN_URL: "http://localhost:3000/cart",
  MAX_RETRIES: 3,
  RETRY_INTERVAL: 2000
};

// Retry mechanism
async function performPaymentWithRetry(data, res) {
  const { CALLBACK_URL, MAX_RETRIES, RETRY_INTERVAL } = paymentConfig;

  let retries = 0;
  let success = false;

  while (!success && retries < MAX_RETRIES) {
    try {
      const response = await axios.post(CHAPA_URL, data, config);
      res.status(200).json({ checkout_url: response.data.data.checkout_url });

      // res.redirect(response.data.data.checkout_url);
      success = true;
    } catch (err) {
      console.error(err);
      retries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
    }
  }

  if (!success) {
    res.status(500).json({ error: "An error occurred while processing the payment." });
  }
}

//add unique value for the user for TEXT_REF and concat it
// Initial payment endpoint
app.post("/api/pay", async (req, res) => {
 const {orderSummary}=req.body
  const TEXT_REF = "tx-myecommerce12345-" + Date.now();

  const data = {
    amount: orderSummary.total_price,
    currency: 'USD',
    email: orderSummary.user.email,
    first_name: orderSummary.user.name,
    tx_ref: TEXT_REF,
    callback_url: paymentConfig.CALLBACK_URL + TEXT_REF,
    return_url: paymentConfig.RETURN_URL
  };

  await performPaymentWithRetry(data, res);
});

// // Verification endpoint
// app.get("/api/verify-payment/:id", async (req, res) => {
//   try {
//     const response = await axios.get("https://api.chapa.co/v1/transaction/verify/tx-myecommerce12345");
//     console.log("Payment was successfully verified");
//   } catch (err) {
//     console.log("Payment can't be verified", err);
//   }
// });


app.get("/api/payment-success", (req, res) => {
  res.status(200).json({ message: 'Payment successful' });
});






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
