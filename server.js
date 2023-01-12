import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import "express-async-errors";

//rest of packages
import morgan from "morgan";
//datababse
import connectDB from "./db/connect.js";

//routes
import authRouter from "./routes/AuthRoutes.js";
import userRouter from "./routes/UserRouter.js";
import productRouter from "./routes/ProductRouter.js";
import reviewRouter from "./routes/ReviewRouter.js";
import orderRouter from "./routes/OrderRouter.js";
//middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import rateLimiter from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import mongoSanitizer from "express-mongo-sanitize";

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitizer());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static("./public"));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("e-comerce api");
});

app.get("/api/v1", (req, res) => {
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.send("e-comerce api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`server is running on port ${port} ...`));
  } catch (error) {
    console.log(error);
  }
};

start();
