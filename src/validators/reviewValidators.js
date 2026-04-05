const {body} = require("express-validator");

const reviewValidator = [
    body("rating")
        .isInt({min:1,max:5})
        .withMessage("Rating is between 1 and 5"),
    
    body("comment")
        .notEmpty()
        .withMessage("Comment is required")
        .isLength({min:10})
        .withMessage("Comment must be at least 10 characters"),
]

module.exports = reviewValidator;