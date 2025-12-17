import jwt from "jsonwebtoken"

const isAuthenticated = async(req,res,next)=>{
    try {
        const token = req.cookies.cookie;
        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success:false
            })
        }
        const decodedUser = await jwt.verify(token,process.env.SECRET_KEY)
        if(!decodedUser){
            return res.status(400).json({
                message:"User not valid",
                success:false
            })
        }
        req.id = decodedUser.userId;
        next()
    } catch (error) {
        console.log(error)
    }
}


export default isAuthenticated;