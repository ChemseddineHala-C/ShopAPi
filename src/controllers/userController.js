const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users);
});

const getUserById = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.params.id);
    if (!user) throw new AppError("user not found",404);
    res.status(200).json(user);
})

const updateUserById = asyncHandler(async (req,res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true},
    );
    if (!user) throw new AppError("user not found",404);
    res.status(201).json(user);
})

const deleteUserById = asyncHandler(async (req,res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new AppError("user not found",404);
    res.status(204).json({message:"User deleted successfully"});
})

const uploadProfilePic = asyncHandler(async (req,res) =>{
    if (!req.file) throw new AppError("Please Upload a file");

    const fileUrl = `${req.prtocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
        req.user.id,
        { profilePic: fileUrl },
        { new: true },
    ).select("-password");

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
        message: "Profile picture uploaded successfully",
        profilePic: fileUrl,
        user,
    });
})

module.exports = {getAllUsers, getUserById, updateUserById, deleteUserById, uploadProfilePic};