import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
      unique:true
    },
    githubUsername: {
      type: String,
      required: true,
      unique:true
    },
    bio: {
      type: String,
    },
    posts:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Post"
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
