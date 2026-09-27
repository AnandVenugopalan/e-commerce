import Product from "../models/productModel.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, image, stock, size } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      brand,
      image,
      stock,
      size,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
      
    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { name, description, price, brand, image, stock, size } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.brand = brand ?? product.brand;
    product.image = image ?? product.image;
    product.stock = stock ?? product.stock;
    product.size = size ?? product.size;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    return res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};

export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};