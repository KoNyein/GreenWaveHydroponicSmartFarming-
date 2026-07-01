"use client";

import { cn } from "@/lib/utils";

interface Column<T> {
  key?: string;
  label?: string;
  accessor?: keyof T | string;
  header?: string;
  render?: (item: T) => React.ReactNode;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ columns, data, keyExtractor, emptyMessage = "No data found", onRowClick }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-card-border">
            {columns.map((col) => (
              <th
                key={col.key ?? String(col.accessor ?? col.header)}
                className={cn("text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3", col.className)}
              >
                {col.label ?? col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-card-border">
          {data.map((item) => (
            <tr
              key={keyExtractor(item)}
              className={cn("hover:bg-gray-50 transition", onRowClick && "cursor-pointer")}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((col) => (
                <td key={col.key ?? String(col.accessor ?? col.header)} className={cn("px-4 py-3 text-sm", col.className)}>
                  {col.cell
                    ? col.cell(item)
                    : col.render
                    ? col.render(item)
                    : String((item as Record<string, unknown>)[String(col.key ?? col.accessor)] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
