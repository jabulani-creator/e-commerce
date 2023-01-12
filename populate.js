import dotenv from "dotenv";
dotenv.config();
import connectDB from "./db/connect.js";
import Product from "./models/Product.js";
import jsonProducts from "./mockData/product.json" assert { type: "json" };

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    await Product.deleteMany();
    await Product.create(jsonProducts);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
