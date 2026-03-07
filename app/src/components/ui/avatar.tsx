"use client";

import * as React from "react";

function AvatarRoot({
  className = "",
  size = "default",
  ...props
}: React.ComponentProps<"span"> & {
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    default: "h-9 w-9",
    lg: "h-10 w-10",
  };
  return (
    <span
      data-slot="avatar"
      className={`relative flex shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

function AvatarImage({
  src,
  alt,
  className = "",
  onError,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={`aspect-square h-full w-full object-cover ${className}`}
      onError={onError}
      {...props}
    />
  );
}

function AvatarFallback({
  className = "",
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={`flex h-full w-full items-center justify-center rounded-full bg-zinc-200 text-zinc-600 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

/** Generic user icon for avatar fallback when no image */
function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-1/2 w-1/2 ${className}`}
      aria-hidden
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
  UserIcon,
});
