import { Navbar } from "@/components/Navbar";
import { Avatar } from "@/components/Avatar";
import { getSuggestedUsers } from "@/data/Data";
import { Heart, MessageCircle, UserPlus } from "lucide-react";

export default function Activity() {
  const suggestedUsers = getSuggestedUsers()
  const activities = [
    {
      id: "1",
      type: "like",
      user: suggestedUsers[0],
      message: "liked your post",
      time: "2h ago",
    },
    {
      id: "2",
      type: "comment",
      user: suggestedUsers[1],
      message: "commented on your post",
      time: "5h ago",
    },
    {
      id: "3",
      type: "follow",
      user: suggestedUsers[2],
      message: "started following you",
      time: "1d ago",
    },
    {
      id: "4",
      type: "like",
      user: suggestedUsers[0],
      message: "liked your post",
      time: "2d ago",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-5 h-5" />;
      case "comment":
        return <MessageCircle className="w-5 h-5" />;
      case "follow":
        return <UserPlus className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Activity</h1>

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-hover transition-colors"
            >
              <Avatar src={activity.user.avatar} alt={activity.user.fullName} size="md" />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{activity.user.username}</span>{" "}
                  <span className="text-muted-foreground">{activity.message}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
              <div className="text-muted-foreground">{getIcon(activity.type)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
