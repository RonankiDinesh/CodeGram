import express from "express"
import { addPost, getAllPost } from "../controllers/post.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router()

router.post("/create",isAuthenticated,addPost)
router.get("/getPost",isAuthenticated,getAllPost)

export default router;