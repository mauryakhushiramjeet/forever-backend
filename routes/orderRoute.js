import express from "express";
import adminAuth from "../midleware/adminAuth.js";
import {
  placeOrder,
  // placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import authUser from "../midleware/auth.js";
const orderRouter = express.Router();
// Admin Features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Feature
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
// orderRouter.post("/razorpay", authUser, placeOrderRazorpay);
orderRouter.post("/verifyStripe", authUser, verifyStripe);
// User Feature
orderRouter.post("/userorders", authUser, userOrders);
export default orderRouter;
