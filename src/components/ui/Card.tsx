import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Card({ children, className, title, subtitle, action }: CardProps) {
  return (
    <div className={cn("bg-card-bg border border-card-border rounded-xl shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <div>
            {title && <h3 className="text-base font-semibold">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  color?: string;
}

export function StatCard({ label, value, icon, change, changeType = "neutral", color = "bg-primary" }: StatCardProps) {
  return (
    <div className="bg-card-bg border border-card-border rounded-xl shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p
              className={cn(
                "text-xs mt-1 font-medium",
                changeType === "up" && "text-green-600",
                changeType === "down" && "text-red-600",
                changeType === "neutral" && "text-gray-500"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white", color)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
