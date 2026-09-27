import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
      minlength: 30,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    brand: {
      type: String,
      required: true
    
    },

    image: {
      type: String,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    size: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;