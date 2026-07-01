"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: number[];
  onValueChange?: (value: number[]) => void;
}

export function Slider({
  value,
  onValueChange,
  className,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const currentValue = value[0] ?? Number(min);

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={currentValue}
      onChange={(event) => onValueChange?.([Number(event.target.value)])}
      className={cn("h-2 w-full cursor-pointer accent-primary", className)}
      {...props}
    />
  );
}
