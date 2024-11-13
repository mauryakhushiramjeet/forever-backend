import mongoose from "mongoose";
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("db connectd");
  });
  mongoose.connection.on("error", (err) => {
    console.error("Database connection error:", err);
  });
  await mongoose.connect(`${process.env.MONGODB_URL}/e-commerce`);
};
export default connectDB;
