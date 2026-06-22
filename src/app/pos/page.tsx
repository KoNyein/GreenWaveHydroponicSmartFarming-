"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Banknote, ArrowRightLeft, Search } from "lucide-react";

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
  const [customerName, setCustomerName] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const activeProducts = mockProducts.filter((p) => p.is_active);
  const filteredProducts = activeProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (!product) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.product_id === productId);
      if (existing) {
        return prev.map((item) =>
          item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product_id: productId, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product_id === productId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowReceipt(true);
  };

  const handleNewSale = () => {
    setCart([]);
    setCustomerName("");
    setShowReceipt(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">POS System</h1>

        {showReceipt ? (
          <Card title="Receipt" className="max-w-md mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold">GreenWave Farm</h2>
              <p className="text-sm text-gray-500">Hydroponic Smart Farming</p>
            </div>
            <div className="border-t border-dashed border-gray-300 py-3">
              {customerName && <p className="text-sm mb-2">Customer: {customerName}</p>}
              <p className="text-sm mb-2">Payment: {paymentMethod.toUpperCase()}</p>
              <p className="text-sm mb-3">Date: {new Date().toLocaleString()}</p>
            </div>
            <div className="border-t border-dashed border-gray-300 py-3 space-y-2">
              {cart.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-300 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span><span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%)</span><span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span><span>{formatCurrency(total)}</span>
              </div>
            </div>
            <button onClick={handleNewSale} className="w-full mt-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition">
              New Sale
            </button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => addToCart(product.id)}
                    className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-primary hover:shadow-md transition group"
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-gray-400 group-hover:text-primary transition" />
                    </div>
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-primary">{formatCurrency(product.price)}</span>
                      <span className="text-xs text-gray-400">Stock: {product.stock_quantity}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <Card title="Cart" action={<span className="text-sm text-gray-500">{cart.length} items</span>}>
              <div className="space-y-4">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
                />

                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">Cart is empty</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.product_id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.price)} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.product_id, -1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product_id, 1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => updateQuantity(item.product_id, -item.quantity)} className="w-6 h-6 rounded bg-red-50 flex items-center justify-center hover:bg-red-100 text-red-500">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <p className="text-sm font-medium mb-2">Payment Method</p>
                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { key: "cash" as const, label: "Cash", icon: Banknote },
                      { key: "card" as const, label: "Card", icon: CreditCard },
                      { key: "transfer" as const, label: "Transfer", icon: ArrowRightLeft },
                    ]).map((pm) => (
                      <button
                        key={pm.key}
                        onClick={() => setPaymentMethod(pm.key)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition ${
                          paymentMethod === pm.key
                            ? "border-primary text-primary bg-green-50"
                            : "border-gray-200 text-gray-500"
                        }`}
                      >
                        <pm.icon className="w-4 h-4" />
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 pt-3 space-y-1">
                  <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span>Tax (10%)</span><span>{formatCurrency(tax)}</span></div>
                  <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>{formatCurrency(total)}</span></div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Checkout
                </button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
