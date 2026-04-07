const {body} = require("express-validator");

const registerValidator = [
    body("name")
        .notEmpty()
        .withMessage("name is required")
        .isLength({min:3})
        .withMessage("Name must be at least 3 characters"),

    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({min:8})
        .withMessage("Password must be at least 8 characters"),

    body("role")
        .isIn(["admin","customer"])
        .withMessage("Role can be just an admin or a customer"),


    body("phone")
        .isEmpty()
        .withMessage("Phone is required")
        .isInt({min:10,max:10})
        .withMessage("Invalid phone format"),
]

const loginValidator = [
    body("email")
        .notEmpty()
        .withMessage("Email are required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
]

module.exports = {registerValidator, loginValidator};
