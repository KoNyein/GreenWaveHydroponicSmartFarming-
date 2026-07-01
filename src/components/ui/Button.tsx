"use client";

import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "destructive";
type ButtonSize = "xs" | "sm" | "default" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variants: Record<ButtonVariant, string> = {
  default: "bg-primary text-white hover:opacity-90",
  outline: "border border-border bg-transparent hover:bg-hover-bg",
  ghost: "bg-transparent hover:bg-hover-bg",
  secondary: "bg-muted text-foreground hover:opacity-90",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-7 px-2 text-xs",
  sm: "h-9 px-3 text-sm",
  default: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

export function Button({
  asChild = false,
  children,
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  const buttonClassName = cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return cloneElement(child, {
      className: cn(buttonClassName, child.props.className),
    });
  }

  return (
    <button type={type} className={buttonClassName} {...props}>
      {children}
    </button>
  );
}
