import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block text-sm font-medium leading-none text-zinc-700 peer-disabled:cursor-not-allowed peer-disabled:text-zinc-400",
          className,
        )}
        {...props}
      />
    );
  },
);

Label.displayName = "Label";

