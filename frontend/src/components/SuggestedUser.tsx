import { Link } from "react-router-dom";
import { Github } from "lucide-react";
import { Avatar } from "./Avatar";
import { User } from "@/data/Data";
import Avvvatars from "avvvatars-react";

interface SuggestedUserProps {
  user: User;
}

export const SuggestedUser = ({ user }: SuggestedUserProps) => {
  return (
    <div className="flex items-center gap-3 py-2">
      <Link to={`/profile/${user.username}`}>
       <Avvvatars value={user.username} size={32} style="shape" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link
          to={`/profile/${user.username}`}
          className="block font-semibold text-sm hover:opacity-60 transition-opacity truncate"
        >
          {user.githubUsername}
        </Link>
        <p className="text-xs text-muted-foreground truncate">{user.fullName}</p>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`https://github.com/${user.githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
        <button className="text-xs font-semibold hover:opacity-60 transition-opacity">
          Follow
        </button>
      </div>
    </div>
  );
};
