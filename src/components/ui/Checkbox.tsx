"use client";

import type { ButtonHTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Checkbox({ checked = false, onCheckedChange, className, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border border-border transition",
        checked ? "bg-primary text-white" : "bg-card",
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {checked && <Check className="h-3.5 w-3.5" />}
    </button>
  );
}
