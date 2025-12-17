import { Navbar } from "@/components/Navbar";
import { Search } from "lucide-react";

export default function Explore() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search coders, repos, or code snippets....."
              className="w-full bg-card border border-border rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Explore CodeGram</h2>
          <p className="text-muted-foreground">
            Discover amazing code snippets and talented developers
          </p>
        </div>
      </div>
    </div>
  );
}
