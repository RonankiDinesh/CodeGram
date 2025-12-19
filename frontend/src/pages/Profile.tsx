// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Github,
  Grid,
  Star,
  Code,
  MoreVertical,
  Trash2,
  Share2,
} from "lucide-react";
import Avvvatars from "avvvatars-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { RootState } from "@/redux/store";
import { getGithubRepos } from "@/data/Data";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------------- TYPES ---------------- */

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
  githubUsername?: string;
  followers?: number;
  following?: number;
  posts?: Post[];
  bookmarks?: Post[];
}

interface GithubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  html_url: string;
}

/* ---------------- COMPONENT ---------------- */

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);

  // 🔥 UI control states (IMPORTANT)
  const [openMenuPostId, setOpenMenuPostId] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);

  /* ---------------- FETCH PROFILE ---------------- */

  useEffect(() => {
    if (!id) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/auth/profile/${id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          toast.error("Failed to fetch profile");
        }
      } catch {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  /* ---------------- FETCH GITHUB REPOS ---------------- */

  useEffect(() => {
    if (!user?.githubUsername) return;

    const fetchRepos = async () => {
      const repos = await getGithubRepos(user.githubUsername);
      setGithubRepos(repos);
    };

    fetchRepos();
  }, [user]);

  /* ---------------- HELPERS ---------------- */
const isOwnProfile = authUser && user ? authUser._id === user._id : false;
const userPosts = user?.posts || [];

const handleDeleteConfirm = async () => {
  try {
    await axios.delete(
      `http://localhost:8000/api/post/delete/${deletePostId}`,
      { withCredentials: true }
    );

    toast.success("Post deleted");

    // Optimistic UI update
    setUser((prev) =>
      prev
        ? {
            ...prev,
            posts: prev.posts?.filter(
              (post) => post._id !== deletePostId
            ),
          }
        : prev
    );

    setDeletePostId(null);
  } catch {
    toast.error("Failed to delete post");
  }
};


  const handleCopyLink = () => {
    if (!sharePost) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/post/${sharePost._id}`
    );
    toast.success("Link copied!");
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">Profile not found</div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          <Avvvatars value={user.username} size={100} style="shape" />

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>

            <Button size="sm" variant={isOwnProfile ? "secondary" : "default"}>
              {isOwnProfile ? "Edit Profile" : "Follow"}
            </Button>

            <p className="mt-3 font-semibold">{user.fullName}</p>
            {user.bio && (
              <p className="text-sm text-muted-foreground">{user.bio}</p>
            )}

            {user.githubUsername && (
              <a
                href={`https://github.com/${user.githubUsername}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 mt-2 text-sm"
              >
                <Github className="w-4 h-4" /> @{user.githubUsername}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-12 border-t border-border">
          {[
            { key: "posts", icon: Grid },
            { key: "starred", icon: Star },
            { key: "repos", icon: Code },
          ].map(({ key, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as Tab)}
              className={`flex items-center gap-2 py-4 uppercase text-sm font-semibold border-t-2 ${
                activeTab === key
                  ? "border-foreground"
                  : "border-transparent text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {key}
            </button>
          ))}
        </div>

        {/* POSTS */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="aspect-square bg-card border border-border rounded-lg p-3"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded">
                    {post.language}
                  </span>

                  <DropdownMenu
                    open={openMenuPostId === post._id}
                    onOpenChange={(open) =>
                      setOpenMenuPostId(open ? post._id : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded hover:bg-muted">
                        <MoreVertical size={16} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenMenuPostId(null);
                          setSharePost(post);
                        }}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>

                      {isOwnProfile && (
                        <DropdownMenuItem
                          onClick={() => {
                            setOpenMenuPostId(null);
                            setDeletePostId(post._id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <pre className="text-xs overflow-hidden">
                  <code>
                    {post.code.length > 100
                      ? post.code.slice(0, 100) + "..."
                      : post.code}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* REPOS */}
        {activeTab === "repos" && (
          <div className="space-y-4 mt-6">
            {githubRepos.map((repo, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold"
                >
                  {repo.name}
                </a>
                <p className="text-sm text-muted-foreground">
                  {repo.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog
        open={!!deletePostId}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePostId(null);
            setOpenMenuPostId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeletePostId(null);
                setOpenMenuPostId(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SHARE MODAL */}
      <Dialog
        open={!!sharePost}
        onOpenChange={(open) => {
          if (!open) {
            setSharePost(null);
            setOpenMenuPostId(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Post</DialogTitle>
          </DialogHeader>

          <Input
            readOnly
            value={
              sharePost
                ? `${window.location.origin}/post/${sharePost._id}`
                : ""
            }
          />
          <Button onClick={handleCopyLink}>Copy Link</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
