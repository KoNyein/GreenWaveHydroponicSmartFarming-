"use client";

import Link from "next/link";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { t } from "@/lib/translations";
import { ShoppingBag, Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default function UserOrdersPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);

  // Mock order data
  const orders = [
    { id: '1', orderNumber: '#12345', date: new Date().toISOString(), status: 'delivered', amount: 150.00, items: 3 },
    { id: '2', orderNumber: '#12344', date: new Date(Date.now() - 86400000).toISOString(), status: 'shipped', amount: 89.50, items: 2 },
    { id: '3', orderNumber: '#12343', date: new Date(Date.now() - 172800000).toISOString(), status: 'processing', amount: 45.25, items: 1 },
    { id: '4', orderNumber: '#12342', date: new Date(Date.now() - 259200000).toISOString(), status: 'cancelled', amount: 25.00, items: 1 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/10 text-green-500';
      case 'shipped':
        return 'bg-blue-500/10 text-blue-500';
      case 'processing':
        return 'bg-orange-500/10 text-orange-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{tr("userOrders.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("userOrders.subtitle")}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/marketplace">
            {tr("userOrders.continueShopping")}
          </Link>
        </Button>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{orders.length}</p>
              <p className="text-sm text-muted">{tr("userOrders.totalOrders")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'delivered').length}</p>
              <p className="text-sm text-muted">{tr("userOrders.completed")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'processing' || o.status === 'shipped').length}</p>
              <p className="text-sm text-muted">{tr("userOrders.inProgress")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}</p>
              <p className="text-sm text-muted">{tr("userOrders.totalSpent")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Orders List */}
      <Card title={tr("userOrders.recentOrders")}>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-hover-bg rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{formatDateTime(order.date)}</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {tr(`status.${order.status}`)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(order.amount)}</p>
                  <p className="text-sm text-muted">{order.items} {tr("userOrders.items")}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/user/orders/${order.id}`}>{tr("userOrders.viewDetails")}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
