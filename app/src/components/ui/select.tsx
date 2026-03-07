import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-md border border-zinc-300 bg-white px-3 py-2 pr-8 text-sm text-zinc-900 shadow-sm transition-colors",
            "placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-400"
        >
          ▾
        </span>
      </div>
    );
  },
);

Select.displayName = "Select";

