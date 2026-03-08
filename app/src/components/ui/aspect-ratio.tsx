"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AspectRatioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, className, style, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("w-full", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    >
      {children}
    </div>
  ),
);
AspectRatio.displayName = "AspectRatio";
