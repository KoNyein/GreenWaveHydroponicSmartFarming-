"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { StatCard, Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  mockZones,
  mockSensorReadings,
  mockSales,
  mockDryRoomBatches,
  mockInventory,
  mockCameras,
  mockDropshipOrders,
} from "@/lib/mock-data";
import {
  Leaf,
  DollarSign,
  Package,
  Camera,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const totalRevenue = mockSales.reduce((s, sale) => s + sale.total_amount, 0);
  const lowStock = mockInventory.filter((i) => i.quantity <= i.min_stock_level);
  const onlineCams = mockCameras.filter((c) => c.is_online);
  const activeBatches = mockDryRoomBatches.filter((b) => b.status === "drying" || b.status === "curing");
  const pendingDropship = mockDropshipOrders.filter((o) => o.status === "pending" || o.status === "processing");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome to GreenWave Hydroponic Smart Farming</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active Zones"
            value={mockZones.filter((z) => z.is_active).length}
            icon={<Leaf className="w-5 h-5" />}
            change={`${mockZones.length} total zones`}
            changeType="neutral"
          />
          <StatCard
            label="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={<DollarSign className="w-5 h-5" />}
            change="+12.5% this month"
            changeType="up"
            color="bg-blue-500"
          />
          <StatCard
            label="Cameras Online"
            value={`${onlineCams.length}/${mockCameras.length}`}
            icon={<Camera className="w-5 h-5" />}
            change={onlineCams.length === mockCameras.length ? "All systems online" : "Some offline"}
            changeType={onlineCams.length === mockCameras.length ? "up" : "down"}
            color="bg-purple-500"
          />
          <StatCard
            label="Low Stock Alerts"
            value={lowStock.length}
            icon={<Package className="w-5 h-5" />}
            change={lowStock.length > 0 ? "Needs attention" : "Stock levels OK"}
            changeType={lowStock.length > 0 ? "down" : "up"}
            color="bg-orange-500"
          />
        </div>

        {/* Zone Sensor Overview */}
        <Card title="Farm Zone Status" subtitle="Real-time sensor readings across all zones">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockZones.map((zone) => {
              const reading = mockSensorReadings.find((r) => r.zone_id === zone.id);
              return (
                <div key={zone.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-sm">{zone.name}</h4>
                    <StatusBadge status={zone.is_active ? "active" : "offline"} />
                  </div>
                  {reading && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Thermometer className="w-3.5 h-3.5 text-red-500" />
                        <span>{reading.temperature.toFixed(1)}°C</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        <span>{reading.humidity.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-yellow-600 font-bold text-[10px]">pH</span>
                        <span>{reading.ph_level.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Wind className="w-3.5 h-3.5 text-teal-500" />
                        <span>{reading.water_level.toFixed(0)}% water</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sales */}
          <Card title="Recent Sales" subtitle="Latest transactions">
            <div className="space-y-3">
              {mockSales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{sale.customer_name ?? "Walk-in"}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(sale.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatCurrency(sale.total_amount)}</p>
                    <StatusBadge status={sale.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Active Operations */}
          <Card title="Active Operations" subtitle="Dry room & dropship status">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <Wind className="w-4 h-4" /> Dry Room ({activeBatches.length} active)
                </h4>
                {activeBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{batch.batch_name}</p>
                      <p className="text-xs text-gray-500">{batch.strain}</p>
                    </div>
                    <StatusBadge status={batch.status} />
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Pending Dropship ({pendingDropship.length})
                </h4>
                {pendingDropship.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(order.total_amount)}</p>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
