const {body} = require("express-validator");

const orderValidator = [
    body("items")
        .notEmpty()
        .withMessage("items are required")
        .isArray()
        .withMessage("Invalid items format"),

    body("items.*.productId")
        .isMongoId()
        .withMessage("Invalid product ID format"),

    body("items.*.quantity")
        .isInt({min:1})
        .withMessage("Quantity must be at least 1"),

    body("address.street")
        .isEmpty()
        .withMessage("Street is required"),
    
    body("address.city")
        .isEmpty()
        .withMessage("City is required"),
    
    body("address.country")
        .isEmpty()
        .withMessage("Country is required"),

]

module.exports = orderValidator;