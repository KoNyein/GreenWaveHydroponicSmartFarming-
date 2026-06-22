"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { Search, ShoppingBag, Tag, Eye, Truck } from "lucide-react";

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = Array.from(new Set(mockProducts.map((p) => p.category)));
  const filtered = mockProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCategory && p.is_active;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Shop</h1>
          <p className="text-gray-500 text-sm mt-1">Browse and manage products</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCategoryFilter("all")}
              className={`px-3 py-2 rounded-lg text-sm ${categoryFilter === "all" ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-2 rounded-lg text-sm ${categoryFilter === cat ? "bg-primary text-white" : "bg-white border border-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition group">
              <div className="relative mb-4">
                <div className="w-full h-40 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition" />
                </div>
                {product.is_dropship && (
                  <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-medium">
                    <Truck className="w-3 h-3" /> Dropship
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{product.category}</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatCurrency(product.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Stock: {product.stock_quantity}</span>
                    <button className="p-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white transition">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
