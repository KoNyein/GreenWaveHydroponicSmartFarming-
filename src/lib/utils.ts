export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    active: "bg-green-100 text-green-800",
    available: "bg-green-100 text-green-800",
    delivered: "bg-green-100 text-green-800",
    paid: "bg-green-100 text-green-800",
    online: "bg-green-100 text-green-800",
    drying: "bg-yellow-100 text-yellow-800",
    curing: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    reserved: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-red-100 text-red-800",
    spoiled: "bg-red-100 text-red-800",
    rejected: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    offline: "bg-gray-100 text-gray-800",
  };
  return colors[status.toLowerCase()] ?? "bg-gray-100 text-gray-800";
}
