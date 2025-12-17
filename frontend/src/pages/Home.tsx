import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { SuggestedUser } from "@/components/SuggestedUser";
import { getAllPosts, getSuggestedUsers,User } from "@/data/Data";
import { useEffect, useState } from "react";

import { useSelector } from "react-redux";  // 👈 ADD THIS

export default function Home() {
  const user = useSelector((state) => state.auth.user);
   const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
   const [posts,setPosts] = useState<User[]>([]);


  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await getSuggestedUsers();
        const posts = await getAllPosts()
        // 🛡 bulletproof guard
        setSuggestedUsers(Array.isArray(users) ? users : []);
        setPosts(Array.isArray(posts) ? posts : []);
      } catch (err) {
        console.error("fetch users error:", err);
        setSuggestedUsers([]);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* 👇 Display logged-in username or other info */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <h1 className="text-xl font-semibold">
          Welcome, {user?.fullName || user?.githubUsername} 👋
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Feed */}
          <div className="flex-1 max-w-2xl mx-auto space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar - Desktop only */}
          <div className="hidden lg:block w-80">
            <div className="sticky top-24">
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground mb-4">
                  Suggestions for you
                </h2>
                <div className="space-y-2">
                  {suggestedUsers.map((user) => (
                    <SuggestedUser key={user.id} user={user} />
                  ))}
                </div>
              </div>

              <div className="mt-8 text-xs text-muted-foreground">
                <p className="mb-2">© 2024 CodeGram</p>
                <p>Built with React, TypeScript & Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
