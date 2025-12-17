
import { useSelector } from "react-redux";
import store from "@/redux/store";
import axios from "axios";

export interface User {
  id: string;
  fullName: string;
  username: string;
  githubUsername: string;
  bio: string;
  avatar: string;
  followers: number;
  following: number;
  postsCount: number;
}

export interface Post {
  id: string;
  author: User;
  code: string;
  language: string;
  title: string;
  caption: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  saved: boolean;
  liked: boolean;
}

export const currentUser = () => {
   const user = useSelector((store)=>store.auth.user)
   return
};

export const getSuggestedUsers = async () => {
  const res = await axios.get(
    "http://localhost:8000/api/auth/getUsers",
    { withCredentials: true }
  );

  return res.data.users; // ✅ return only users
};
export const getAllPosts = async()=>{
  const res = await axios.get("http://localhost:8000/api/post/getPost",
    {withCredentials:true}
  )
  return res.data.posts;
}

export const getGithubRepos = async(username) =>{
  const res = await axios.get(`https://api.github.com/users/${username}/repos`)
  return res.data
}