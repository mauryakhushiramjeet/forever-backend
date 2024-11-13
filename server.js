import express from "express";
import cors from "cors";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary.js";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

//  App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
//middlewares

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5174", // Replace with the frontend URL
//   })
// );
const serverStart = async () => {
  await connectCloudinary();
  // api endpoints

  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/cart",cartRouter);
  app.use('/api/order',orderRouter)

  app.get("/", (req, res) => {
    res.send("API WORKING");
  });

  app.listen(port, () => console.log("server started running on port :", port));
};
serverStart();
