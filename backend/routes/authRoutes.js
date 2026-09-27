import express from "express";
import { validationResult } from "express-validator";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "../controllers/authController.js";

import {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} from "../validators/authValidators.js";

import authMiddleware from "../middleware/middleware.js";

import { getProfile } from "../controllers/userController.js";

const router = express.Router();

// Register
router.post(
  "/register",
  registerValidator,
  (req, res, next) => {
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
  },
  registerUser
);

// Login
router.post(
  "/login",
  loginValidator,
  (req, res, next) => {
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
  },
  loginUser
);

// Refresh access token
router.post(
  "/refresh-token",
  refreshTokenValidator,
  (req, res, next) => {
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
  },
  refreshAccessToken
);

// Logout
router.post("/logout", authMiddleware, logoutUser);

// Logged-in user's profile
router.get("/me", authMiddleware, getProfile);

export default router;