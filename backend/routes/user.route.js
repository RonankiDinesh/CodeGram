import express from "express"
import { login, register,getProfile,logout, getAllUsers } from "../controllers/user.controller.js"
import isAuthenticated from "../middleware/isAuthenticated.js"

const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.get("/profile/:id",isAuthenticated,getProfile)
router.get("/getUsers",isAuthenticated,getAllUsers)

export default router;