"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { t } from "@/lib/translations";
import {
  Heart,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";

export default function UserWishlistPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  // Mock wishlist items
  const wishlistItems = [
    { id: '1', name: 'Hydroponic Grow Kit', price: 125.00, image: '/images/product-1.jpg', inStock: true, rating: 4.5 },
    { id: '2', name: 'Premium Nutrient Solution', price: 45.50, image: '/images/product-2.jpg', inStock: true, rating: 4.8 },
    { id: '3', name: 'LED Grow Light 600W', price: 289.99, image: '/images/product-3.jpg', inStock: false, rating: 4.7 },
    { id: '4', name: 'pH Test Kit', price: 19.99, image: '/images/product-4.jpg', inStock: true, rating: 4.2 },
  ];

  const removeFromWishlist = (id: string) => {
    // Remove from wishlist logic
    console.log('Remove from wishlist:', id);
  };

  const addToCart = (id: string) => {
    // Add to cart logic
    console.log('Add to cart:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("wishlist.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("wishlist.subtitle")}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/marketplace">
            {tr("wishlist.continueShopping")}
          </Link>
        </Button>
      </div>

      {/* Wishlist Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wishlistItems.length}</p>
              <p className="text-sm text-muted">{tr("wishlist.totalItems")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wishlistItems.filter(i => i.inStock).length}</p>
              <p className="text-sm text-muted">{tr("wishlist.inStock")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{wishlistItems.filter(i => !i.inStock).length}</p>
              <p className="text-sm text-muted">{tr("wishlist.outOfStock")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(wishlistItems.reduce((sum, item) => sum + item.price, 0))}</p>
              <p className="text-sm text-muted">{tr("wishlist.totalValue")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Wishlist Items */}
      <Card title={tr("wishlist.yourWishlist")}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-muted/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img 
                    src={item.image || '/images/placeholder.jpg'} 
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-semibold text-accent">{formatCurrency(item.price)}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-muted">{item.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    {item.inStock ? (
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full">
                        {tr("wishlist.inStock")}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-500 rounded-full">
                        {tr("wishlist.outOfStock")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromWishlist(item.id)}
                  className="gap-2 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  {tr("wishlist.remove")}
                </Button>
                <Button
                  size="sm"
                  onClick={() => addToCart(item.id)}
                  disabled={!item.inStock}
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {tr("wishlist.addToCart")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {wishlistItems.length === 0 && (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted mb-4">{tr("wishlist.emptyWishlist")}</p>
            <Button asChild>
              <Link href="/marketplace">{tr("wishlist.browseProducts")}</Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
