import express from "express";
import { validationResult } from "express-validator";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middleware/middleware.js";

import {
  productValidator,
  updateProductValidator,
  productIdValidator,
} from "../validators/productValidator.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
      })),
    });
  }

  next();
};


router.post("/", authMiddleware, productValidator, validate, createProduct);
router.get("/", getProducts);
router.get("/:id", productIdValidator, validate, getProduct);
router.put(
  "/:id",
  authMiddleware,
  productIdValidator,
  updateProductValidator,
  validate,
  updateProduct,
);
router.delete(
  "/:id",
  authMiddleware,
  productIdValidator,
  validate,
  deleteProduct,
);

export default router;
