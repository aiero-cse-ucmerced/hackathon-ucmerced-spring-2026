import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** When true, shows invalid/error state (red border and focus ring). Use with aria-invalid for accessibility. */
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={invalid ?? props["aria-invalid"]}
        className={cn(
          "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors",
          "placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400",
          invalid
            ? "border-red-500 focus-visible:ring-red-500"
            : "border-zinc-300 focus-visible:ring-zinc-900",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

