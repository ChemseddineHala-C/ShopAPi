const {body} = require("express-validator");

const productValidator = [
    body("name")
        .notEmpty()
        .withMessage("name is required"),

    body("description")
        .notEmpty()
        .withMessage("Description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({min:0})
        .withMessage("Price can not be negative"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({min:0})
        .withMessage("Stock can not be negative"),

    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isIn(["electronics","clothing","books","food","other"])
        .withMessage("Invalid category")
    
]

module.exports = productValidator;