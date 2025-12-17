// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Github, Grid, Star, Code } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { RootState } from "@/redux/store";
import { getGithubRepos } from "@/data/Data";

type Tab = "posts" | "starred" | "repos";

interface Post {
  _id: string;
  language: string;
  code: string;
  author: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface UserProfile {
  _id: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  githubUsername?: string;
  followers?: number;
  following?: number;
  posts?: Post[];
  bookmarks?: Post[];
}

export default function Profile() {
  // 👇 make sure route is /profile/:id
  const { id } = useParams<{ id: string }>();

  // logged-in user from authSlice
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [githubRepos,setGithubRepos] = useState([])
  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/auth/profile/${id}`, {
          withCredentials: true, // if you're using cookies
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          toast.error(res.data.message || "Failed to fetch profile");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching profile");
      } finally {
        setLoading(false);
      }
    };

    const getRepos = async()=>{
    const repo = await getGithubRepos(user.githubUsername)
    setGithubRepos(repo);
    }
    fetchProfile();
    getRepos()
  }, [id]);

  const isOwnProfile =
    authUser && user ? authUser._id === user._id : false;

  const userPosts: Post[] = user?.posts || [];
  const postsCount = userPosts.length;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-6">
            <Avatar src={user.avatar} alt={user.fullName} size="xl" />

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">{user.githubUsername}</h1>
                <Button
                  variant={isOwnProfile ? "secondary" : "default"}
                  size="sm"
                >
                  {isOwnProfile ? "Edit Profile" : "Follow"}
                </Button>
              </div>

              <div className="flex gap-8 mb-4">
                <div>
                  <span className="font-semibold">{postsCount}</span>{" "}
                  <span className="text-muted-foreground">posts</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {user.followers?.toLocaleString() ?? 0}
                  </span>{" "}
                  <span className="text-muted-foreground">followers</span>
                </div>
                <div>
                  <span className="font-semibold">
                    {user.following?.toLocaleString() ?? 0}
                  </span>{" "}
                  <span className="text-muted-foreground">following</span>
                </div>
              </div>

              <div>
                <p className="font-semibold mb-1">{user.fullName}</p>
                {user.bio && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {user.bio}
                  </p>
                )}
                {user.githubUsername && (
                  <a
                    href={`https://github.com/${user.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60 transition-opacity"
                  >
                    <Github className="w-4 h-4" />
                    @{user.githubUsername}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-border">
          <div className="flex justify-center gap-12">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 py-4 border-t-2 ${
                activeTab === "posts"
                  ? "border-foreground"
                  : "border-transparent text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              <Grid className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab("starred")}
              className={`flex items-center gap-2 py-4 border-t-2 ${
                activeTab === "starred"
                  ? "border-foreground"
                  : "border-transparent text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase">Starred</span>
            </button>
            <button
              onClick={() => setActiveTab("repos")}
              className={`flex items-center gap-2 py-4 border-t-2 ${
                activeTab === "repos"
                  ? "border-foreground"
                  : "border-transparent text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              <Code className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase">Repos</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "posts" && (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {userPosts.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No posts yet
                </div>
              )}

              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="aspect-square bg-card border border-border rounded-lg p-3 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {post.language}
                    </span>
                  </div>
                  <pre className="text-xs overflow-hidden">
                    <code>
                      {post.code.length > 100
                        ? `${post.code.slice(0, 100)}...`
                        : post.code}
                    </code>
                  </pre>
                </div>
              ))}
            </div>
          )}

          {activeTab === "starred" && (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No starred posts yet</p>
            </div>
          )}

          {activeTab === "repos" && (
            <div className="space-y-4">
            
              {githubRepos.map((repo, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-lg p-4 hover:bg-hover transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground">
                      {repo.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">{repo.stars}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {repo.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-foreground rounded-full" />
                    <span className="text-xs text-muted-foreground">
                      {repo.language}
                    </span>
                  </div>
                  <div>
                     <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-foreground hover:opacity-60 transition-opacity"
                  >
                    <Github className="w-4 h-4" />
                   Visit @{repo.name}
                  </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
