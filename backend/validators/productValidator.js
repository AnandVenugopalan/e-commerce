import { body, param } from "express-validator";

const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required"),

  body("image")
    .trim()
    .notEmpty()
    .withMessage("Image is required"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Should atleast contain 1 stock"),

  body("size")
    .isArray({ min: 1 })
    .withMessage("Should atleast contain 1 size"),

  body("size.*")
    .trim()
    .notEmpty()
    .withMessage("Each size must contain a value"),
];

const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),
];



const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("brand")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Brand cannot be empty"),

  body("image")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Image cannot be empty"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a  number greater than or equal to 0"),

  body("size")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Size must be a non-empty array"),

  body("size.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Each size must contain a value"),




];

export {
  productValidator,
  productIdValidator,
  updateProductValidator,
};