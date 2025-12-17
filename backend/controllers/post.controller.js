import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const addPost = async (req, res) => {
  try {
    const { title, code, language, repoLink, caption } = req.body;
    const userId = req.id;
    if (!title || !code || !language || !caption) {
      return res.status(401).json({ message: "Some fields are missing" });
    }
    const post = await Post.create({
      title,
      code,
      language,
      repoLink,
      caption,
      author: userId,
    });
    const user = await User.findById(userId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async(req,res)=>{
  try {
    const posts = await Post.find().lean()
    return res.status(200).json({
      success:true,
      posts
    })
  } catch (error) {
   console.log(error) 
  }
}