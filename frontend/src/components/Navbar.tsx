import { Link, useLocation } from "react-router-dom";
import { Home, Compass, PlusSquare, Heart, User, Search } from "lucide-react";
import { Avatar } from "./Avatar";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Avvvatars from "avvvatars-react";

export const Navbar = () => {
  const location = useLocation();

  const authUser = useSelector((state: RootState) => state.auth.user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            CodeGram
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search coders or repos..."
                className="w-full bg-secondary border border-border rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className={cn(
                "hover:opacity-60 transition-opacity",
                isActive("/") && "opacity-100"
              )}
            >
              <Home className="w-6 h-6" strokeWidth={isActive("/") ? 2.5 : 2} />
            </Link>
            <Link
              to="/explore"
              className={cn(
                "hover:opacity-60 transition-opacity",
                isActive("/explore") && "opacity-100"
              )}
            >
              <Compass className="w-6 h-6" strokeWidth={isActive("/explore") ? 2.5 : 2} />
            </Link>
            <Link
              to="/create"
              className={cn(
                "hover:opacity-60 transition-opacity",
                isActive("/create") && "opacity-100"
              )}
            >
              <PlusSquare className="w-6 h-6" strokeWidth={isActive("/create") ? 2.5 : 2} />
            </Link>
            <Link
              to="/activity"
              className={cn(
                "hover:opacity-60 transition-opacity",
                isActive("/activity") && "opacity-100"
              )}
            >
              <Heart className="w-6 h-6" strokeWidth={isActive("/activity") ? 2.5 : 2} />
            </Link>

            {/* FIX: Navigate by ID, not username */}
            <Link
              to={`/profile/${authUser?._id}`}
              className={cn(
                "hover:opacity-80 transition-opacity",
                isActive(`/profile/${authUser?._id}`) && "ring-2 ring-foreground rounded-full"
              )}
            >
              <Avvvatars value={authUser.username} size={32} style="shape" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
