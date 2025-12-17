import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Github } from "lucide-react";
import { Avatar } from "./Avatar";
import { Post } from "@/data/Data";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar src={post.author.avatar} alt={post.author.fullName} size="md" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{post.author.username}</span>
            <a
              href={`https://github.com/${post.author.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
          <span className="text-xs text-muted-foreground">{post.timestamp}</span>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="mx-4 mb-3 bg-code-bg border border-code-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-code-border">
          <span className="text-xs font-medium">{post.title}</span>
          <span className="text-xs bg-secondary px-2 py-1 rounded">{post.language}</span>
        </div>
        <pre className="p-4 overflow-x-auto">
          <code className="text-sm text-foreground">{post.code}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pb-2">
        <button
          onClick={handleLike}
          className="hover:opacity-60 transition-opacity"
          aria-label="Like post"
        >
          <Heart
            className={cn("w-6 h-6", liked && "fill-foreground")}
            strokeWidth={2}
          />
        </button>
        <button className="hover:opacity-60 transition-opacity" aria-label="Comment">
          <MessageCircle className="w-6 h-6" strokeWidth={2} />
        </button>
        <button className="hover:opacity-60 transition-opacity" aria-label="Share">
          <Share2 className="w-6 h-6" strokeWidth={2} />
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className="ml-auto hover:opacity-60 transition-opacity"
          aria-label="Save post"
        >
          <Bookmark
            className={cn("w-6 h-6", saved && "fill-foreground")}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Engagement */}
      {/* <div className="px-4 pb-2">
        <p className="text-sm font-semibold">{likesCount.toLocaleString()} likes</p>
      </div> */}

      {/* Caption */}
      <div className="px-4 pb-3">
        <p className="text-sm">
          <span className="font-semibold mr-2">{post.author.username}</span>
          {post.caption}
        </p>
        {post.commentsCount > 0 && (
          <button className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors">
            View all {post.commentsCount} comments
          </button>
        )}
      </div>
    </article>
  );
};
