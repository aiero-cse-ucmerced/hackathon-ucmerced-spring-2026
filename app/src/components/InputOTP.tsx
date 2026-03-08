"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 8;

export function InputOTP({
  value,
  onChange,
  disabled,
  className,
  "aria-label": ariaLabel = "Verification code",
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}) {
  const digits = value.padEnd(OTP_LENGTH, " ").split("").slice(0, OTP_LENGTH);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, char: string) => {
    const d = char.replace(/\D/g, "");
    if (d.length > 1) {
      const pasted = d.slice(0, OTP_LENGTH - index);
      let newValue = value.slice(0, index);
      pasted.split("").forEach((c, i) => {
        if (index + i < OTP_LENGTH) newValue += c;
      });
      onChange(newValue.slice(0, OTP_LENGTH));
      const next = Math.min(index + pasted.length, OTP_LENGTH - 1);
      inputRefs.current[next]?.focus();
      return;
    }
    const single = d.slice(0, 1);
    const newValue = value.slice(0, index) + single + value.slice(index + 1);
    onChange(newValue.slice(0, OTP_LENGTH));
    if (single && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newValue = value.slice(0, index - 1);
      onChange(newValue);
    }
  };

  return (
    <div
      className={cn("flex gap-1.5 justify-center", className)}
      role="group"
      aria-label={ariaLabel}
    >
      {Array.from({ length: OTP_LENGTH }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digits[i] === " " ? "" : digits[i]}
          disabled={disabled}
          className={cn(
            "h-12 w-11 rounded-md border bg-white text-center text-lg font-semibold tabular-nums shadow-sm transition-colors",
            "border-zinc-300 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400"
          )}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={(e) => {
            e.preventDefault();
            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
            let newValue = value.slice(0, i);
            pasted.split("").forEach((c) => { if (newValue.length < OTP_LENGTH) newValue += c; });
            onChange(newValue);
            const next = Math.min(i + pasted.length, OTP_LENGTH - 1);
            inputRefs.current[next]?.focus();
          }}
          aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
        />
      ))}
    </div>
  );
}
