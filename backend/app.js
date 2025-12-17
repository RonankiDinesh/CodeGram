import express, { urlencoded } from "express"
import connectDB from "./config/db.js"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()
connectDB()

app.use(
  cors({
    origin: "http://localhost:8080", 
    credentials: true,               
  })
);
app.use(urlencoded())
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/post",postRoutes)
const PORT = process.env.PORT ||8000 
app.listen(PORT,()=>{
    console.log("Server Connected")
})