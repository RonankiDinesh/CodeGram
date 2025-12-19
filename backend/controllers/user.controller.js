import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullName, email, password, githubUsername, bio,username } = req.body;
    if (!fullName || !email || !password || !githubUsername || username) {
      return res.status(400).json({ message: "Some fields are missing" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName,
      email: email,
      password: hashPassword,
      githubUsername: githubUsername,
      bio: bio,
      username:username
    });
    const safeUser = user.toObject();
    delete safeUser.password;
    return res.status(200).json({
      user: safeUser,
      success: true,
      message: "User Created successfully",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Some fields are missing" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const userPassword = await user.password;
    const comparePassword = await bcrypt.compare(password, userPassword);
    if (!comparePassword) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    // remove password before sending to frontend
    const cookie = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    const populatedUser = await User.findById(user._id).populate({
      path: "posts",
      match: { author: user._id },
    });
    const cookieOptions = {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    };

    const populatedPosts = populatedUser.posts;
    const safeUser = populatedUser.toObject();
    delete safeUser.password;
    return res
      .status(200)
      .cookie("cookie", cookie, cookieOptions)
      .json({ user: safeUser, success: true, message: "User logged in" });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async(req,res)=>{
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate({ path: "posts", createdAt: -1 })
    return res.status(200).json({
      message: "Profile fetched successfully",
      user,
      success: true,})
  } catch (error) {
    console.log(error)
  }
}
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .lean(); // 🔥 VERY IMPORTANT

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};