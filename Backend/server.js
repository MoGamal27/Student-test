import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51QCrAHE3MxiHn73kVDATgFJEuxfZbQmcFdWvLTy6qvbq34akLLCdwaSlHjml3xfpoLApdpvduUmHGRnK9atheuXQ00jXfwFQEy'); // initialize Stripe with the secret key


//app config 
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


// middleware
app.use(express.json());
app.use(cors());

//endpoint
app.use('/api/admin', adminRouter)

//payonline
app.post('/create-payment-intent', async (req, res) => {
  const { payment_method } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // amount in cents
      currency: 'usd',
      payment_method,
      confirm: true,
    });

  res.json({ success: true, paymentIntent });
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
});


////

app.get('/' , (req,res)=> {
    res.send('API WORK')
})

app.listen(port, ()=> console.log('Database' ,  port))