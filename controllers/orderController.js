import { response } from "express";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";
// import { currency } from "../../admin/src/App.jsx";
const currency = "inr";
const deliveryCharges = 10;
//gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const razorPayInstance = new razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });
// placing orders using cod case on delevery Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// placing orders using Stripe  Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharges * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });
    console.log("Stripe session created:", session);

    res.json({ success: true, success_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// verify stripe
const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;
  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndUpdate(orderId);
      res.json({ success: false });
    }
  } catch (error) {
   console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// placing orders using Rezopay  Method

// const placeOrderRazorpay = async (req, res) => {
  // try {
  //   const { userId, items, amount, address } = req.body;
  //   const orderData = {
  //     userId,
  //     items,
  //     amount,
  //     address,
  //     paymentMethod: "Razorpay",
  //     payment: false,
  //     date: Date.now(),
  //   };
  //   const newOrder = new orderModel(orderData);
  //   await newOrder.save();
  //   const options = {
  //     amount: amount * 100,
  //     currency: currency.toUpperCase(),
  //     receipt: newOrder._id.toString(),
  //   };
  //   await razorPayInstance.orders.create(options, (error, order) => {
  //     if (error) {
  //       console.log(error);
  //       return res.json({ success: false, message: error });
  //     }
  //     res.json({ success: true, order });
  //   });
  // } catch (error) {
  //  console.log(error);
  //   res.json({ success: false, message: error.message });
  // }
// };

// All Order data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// update order status from Admin Pannel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};
export {
  placeOrder,
  // placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  placeOrderStripe,
  verifyStripe,
};
