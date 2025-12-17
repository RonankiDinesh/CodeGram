import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
};

export const Avatar = ({ src, alt, size = "md", className }: AvatarProps) => {
  return (
    <div
      className={cn(
        "rounded-full overflow-hidden border border-border bg-card flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
};
