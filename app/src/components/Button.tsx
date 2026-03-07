import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  asChild?: boolean;
  /** Optional icon to render before the label */
  icon?: ReactNode;
  /** Optional icon to render after the label (e.g. → for Get Started) */
  iconAfter?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "rounded-lg bg-[#171717] text-white border border-transparent hover:bg-[#2a2a2a] focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2",
  secondary:
    "rounded-lg bg-white text-[#171717] border border-[#171717] hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:ring-offset-2",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  icon,
  iconAfter,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 min-w-[140px] items-center justify-center gap-2 px-6 text-base font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="flex shrink-0" aria-hidden>{icon}</span>}
      {children}
      {iconAfter && <span className="flex shrink-0" aria-hidden>{iconAfter}</span>}
    </button>
  );
}
