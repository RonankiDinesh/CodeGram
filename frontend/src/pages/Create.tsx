import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/Avatar";
import { currentUser } from "@/data/Data";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "@/redux/store";

export default function Create() {
  const navigate = useNavigate();
  const user = useSelector((store)=>store.auth.user)
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    language: "JavaScript",
    repoLink: "",
    caption: "",
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "http://localhost:8000/api/post/create",
      formData,
      { withCredentials: true }
    );
     navigate(`/profile/${user._id}`)
      toast.success("Post created successfully");
  } catch (error) {
    console.error("Post creation error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
  }
};

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                type="text"
                placeholder="e.g., Custom React Hook for API Calls"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Code Snippet</label>
              <Textarea
                placeholder="Paste your code here..."
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                className="bg-card font-mono text-sm resize-none"
                rows={12}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({ ...formData, language: e.target.value })
                }
                className="w-full bg-card border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Python">Python</option>
                <option value="Rust">Rust</option>
                <option value="Go">Go</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Ruby">Ruby</option>
                <option value="PHP">PHP</option>
                <option value="Swift">Swift</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                GitHub Repository Link (Optional)
              </label>
              <Input
                type="url"
                placeholder="https://github.com/username/repo"
                value={formData.repoLink}
                onChange={(e) =>
                  setFormData({ ...formData, repoLink: e.target.value })
                }
                className="bg-card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Caption</label>
              <Textarea
                placeholder="Tell us about your code..."
                value={formData.caption}
                onChange={(e) =>
                  setFormData({ ...formData, caption: e.target.value })
                }
                className="bg-card resize-none"
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={!formData.title || !formData.code}
            >
              Create Post
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-3 p-4">
                <Avatar src={currentUser.avatar} alt={currentUser.fullName} size="md" />
                <div>
                  <div className="font-semibold text-sm">{currentUser.username}</div>
                  <div className="text-xs text-muted-foreground">Just now</div>
                </div>
              </div>

              {/* Code Preview */}
              {formData.code && (
                <div className="mx-4 mb-3 bg-code-bg border border-code-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-code-border">
                    <span className="text-xs font-medium">
                      {formData.title || "Untitled"}
                    </span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">
                      {formData.language}
                    </span>
                  </div>
                  <pre className="p-4 overflow-x-auto max-h-64">
                    <code className="text-sm">{formData.code}</code>
                  </pre>
                </div>
              )}

              {/* Caption Preview */}
              {formData.caption && (
                <div className="px-4 pb-4">
                  <p className="text-sm">
                    <span className="font-semibold mr-2">{currentUser.username}</span>
                    {formData.caption}
                  </p>
                </div>
              )}

              {/* Empty state */}
              {!formData.code && !formData.caption && (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">Your post preview will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
