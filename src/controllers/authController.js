const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createToken = (user) => {
    return jwt.sign(
        {id:user._id, email:user.email, role:user.role},
        process.env.JWT_SECRET);
}

const register = asyncHandler(async(req,res) => {
    const {name, email, password, role, address, phone} = req.body;

    const existingEmail = await findOne({email:email});
    if (existingEmail) throw new AppError("Email already registred",500);

    const hashPassowrd = await bcrypt.hash(password,10);

    const newUser = await User.create({
        name: name,
        email: email,
        passowrd: hashpassword,
        role: role,
        phone: phone,
        address : address,
    });

    const token = createToken(newUser);

    res.status(201).json({
        message: "User registred successfully",
        token: token,
        user: {name: newUser.name, email: newUser.email, role: newUser.role, address:newUser.address, phone:newUser.phone}
    });
})

const login = asyncHandler(async (req,res) => {
    const {email, password} = req.body;

    const user = await findOne({email:email});
    if (!user) throw new AppError("Invalid email or password",401);

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) throw new AppError("Invalid email or password",401);
    
    const token = createToken(user);

    res.status(200).json({
        message: "Login successful",
        token: token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, address: user.address, phone: user.phone },
    })
})

module.exports = {register, login};