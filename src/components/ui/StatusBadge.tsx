import { getStatusColor } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-0.5 text-xs"} ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
