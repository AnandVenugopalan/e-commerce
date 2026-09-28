import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";




const app = express();

app.use(
  cors({
    origin: "https://e-commerce-1-a58w.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes)


export default app;