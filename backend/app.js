import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";




const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


export default app;