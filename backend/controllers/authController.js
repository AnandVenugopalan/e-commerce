import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({
      message: "Email already registered",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  return res.status(201).json({
    message: "User registered successfully",
    user: userResponse,
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );

  user.refreshToken = refreshToken;

  await user.save();

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "Login successful",
    accessToken,
  });
};

const refreshAccessToken = async (req, res) => {
      


  try {
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token is required",
      });
    }

       

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

   

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }


    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }
  user.refreshToken = null;
  await user.save();
  res.clearCookie("refreshToken");
  return res.status(200).json({
    message: "Logout successful",
  });
};

export { registerUser, loginUser, refreshAccessToken, logoutUser };
