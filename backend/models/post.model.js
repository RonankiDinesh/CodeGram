    // title: "",
    // code: "",
    // language: "JavaScript",
    // repoLink: "",
    // caption: "",


import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    repoLink:{
        type:String
    },
    caption:{
        type:String,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required :true
    }
},{timestamps:true})

const Post = mongoose.model("Post",postSchema)
export default Post;