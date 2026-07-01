"use client";

import { createContext, useContext, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

export function Select({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const context = useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-lg border border-border bg-card px-3 text-sm",
        className
      )}
      onClick={() => context?.setOpen(!context.open)}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const context = useContext(SelectContext);
  return <span>{context?.value || placeholder}</span>;
}

export function SelectContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const context = useContext(SelectContext);

  if (!context?.open) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-lg border border-border bg-card p-1 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = useContext(SelectContext);

  return (
    <button
      type="button"
      className={cn("block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-hover-bg", className)}
      onClick={() => {
        context?.onValueChange?.(value);
        context?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}
