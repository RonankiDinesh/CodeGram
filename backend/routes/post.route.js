import express from "express"
import { addPost, getAllPost,deletePost } from "../controllers/post.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router()

router.post("/create",isAuthenticated,addPost)
router.get("/getPost",isAuthenticated,getAllPost)
router.delete("/delete/:id", isAuthenticated, deletePost);

export default router;