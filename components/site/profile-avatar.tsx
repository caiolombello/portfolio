import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src: string;
  size: number;
  /** Decorative by default: the name is usually rendered right next to it */
  alt?: string;
  /** Green "available" dot */
  status?: boolean;
  priority?: boolean;
  className?: string;
}

export function ProfileAvatar({
  src,
  size,
  alt = "",
  status = false,
  priority = false,
  className,
}: ProfileAvatarProps) {
  const dot = Math.max(9, Math.round(size * 0.26));

  return (
    <span
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        sizes={`${size}px`}
        priority={priority}
        className="h-full w-full rounded-full bg-muted object-cover ring-1 ring-border"
      />
      {status && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 right-0 rounded-full border-2 border-background bg-success"
          style={{ width: dot, height: dot }}
        />
      )}
    </span>
  );
}
