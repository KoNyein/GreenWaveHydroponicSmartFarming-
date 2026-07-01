import type { HTMLAttributes, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted", className)}
      {...props}
    />
  );
}

export function AvatarImage({ className, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("h-full w-full object-cover", className)} alt={alt} {...props} />;
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center bg-muted text-muted", className)}
      {...props}
    />
  );
}
