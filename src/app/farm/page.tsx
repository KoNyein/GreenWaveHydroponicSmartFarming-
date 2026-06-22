"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import { mockZones, mockSensorReadings, mockSchedules, generateSensorHistory } from "@/lib/mock-data";
import type { FarmZone } from "@/types/database";
import {
  Thermometer,
  Droplets,
  Sun,
  Beaker,
  Waves,
  Zap,
  Clock,
  Play,
  Pause,
  Settings,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function FarmPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [selectedZone, setSelectedZone] = useState<FarmZone>(mockZones[0]);
  const reading = mockSensorReadings.find((r) => r.zone_id === selectedZone.id);
  const zoneSchedules = mockSchedules.filter((s) => s.zone_id === selectedZone.id);
  const history = generateSensorHistory(selectedZone.id, 24);

  const chartData = history.map((h) => ({
    time: new Date(h.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    temperature: Number(h.temperature.toFixed(1)),
    humidity: Number(h.humidity.toFixed(1)),
    ph: Number(h.ph_level.toFixed(2)),
    water: Number(h.water_level.toFixed(0)),
  }));

  const actionTypeLabels: Record<string, string> = {
    water: "Watering",
    nutrient: "Nutrient Feed",
    light_on: "Lights On",
    light_off: "Lights Off",
    ph_adjust: "pH Adjustment",
    harvest: "Harvest",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{tr("farm.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("farm.subtitle")}</p>
        </div>

        {/* Zone Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {mockZones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedZone.id === zone.id
                  ? "bg-primary text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {zone.name}
            </button>
          ))}
        </div>

        {/* Sensor Stats */}
        {reading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            <StatCard
              label={tr("farm.temperature")}
              value={`${reading.temperature.toFixed(1)}°C`}
              icon={<Thermometer className="w-4 h-4" />}
              color="bg-red-500"
            />
            <StatCard
              label={tr("farm.humidity")}
              value={`${reading.humidity.toFixed(1)}%`}
              icon={<Droplets className="w-4 h-4" />}
              color="bg-blue-500"
            />
            <StatCard
              label={tr("farm.phLevel")}
              value={reading.ph_level.toFixed(2)}
              icon={<Beaker className="w-4 h-4" />}
              color="bg-yellow-500"
            />
            <StatCard
              label={tr("farm.ecLevel")}
              value={`${reading.ec_level.toFixed(2)} mS`}
              icon={<Zap className="w-4 h-4" />}
              color="bg-purple-500"
            />
            <StatCard
              label={tr("farm.waterLevel")}
              value={`${reading.water_level.toFixed(0)}%`}
              icon={<Waves className="w-4 h-4" />}
              color="bg-teal-500"
            />
            <StatCard
              label={tr("farm.light")}
              value={`${reading.light_intensity.toFixed(0)} lux`}
              icon={<Sun className="w-4 h-4" />}
              color="bg-orange-500"
            />
            <StatCard
              label={tr("farm.nutrientPpm")}
              value={reading.nutrient_ppm.toFixed(0)}
              icon={<Beaker className="w-4 h-4" />}
              color="bg-green-600"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title={tr("farm.tempHumidity24h")}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} dot={false} name="Temp (°C)" />
                  <Line type="monotone" dataKey="humidity" stroke="#3b82f6" strokeWidth={2} dot={false} name="Humidity (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title={tr("farm.phWater24h")}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={3} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ph" stroke="#eab308" strokeWidth={2} dot={false} name="pH" />
                  <Line type="monotone" dataKey="water" stroke="#14b8a6" strokeWidth={2} dot={false} name="Water (%)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Controls & Schedules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Controls */}
          <Card title={tr("farm.quickControls")} subtitle={`${tr("farm.zone")}: ${selectedZone.name}`}>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Water Pump", icon: Droplets, active: true, color: "blue" },
                { label: "Nutrient Feed", icon: Beaker, active: false, color: "green" },
                { label: "Grow Lights", icon: Sun, active: true, color: "yellow" },
                { label: "pH Adjust", icon: Settings, active: false, color: "purple" },
              ].map((ctrl) => (
                <button
                  key={ctrl.label}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                    ctrl.active
                      ? "border-primary bg-green-50 text-primary"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <ctrl.icon className="w-5 h-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{ctrl.label}</p>
                    <p className="text-xs">{ctrl.active ? "Running" : "Stopped"}</p>
                  </div>
                  {ctrl.active ? (
                    <Pause className="w-4 h-4 ml-auto" />
                  ) : (
                    <Play className="w-4 h-4 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Schedules */}
          <Card title={tr("farm.automationSchedules")} subtitle={tr("farm.configuredTasks")}>
            <div className="space-y-3">
              {zoneSchedules.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">{tr("farm.noSchedules")}</p>
              ) : (
                zoneSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{actionTypeLabels[schedule.action_type] ?? schedule.action_type}</p>
                        <p className="text-xs text-gray-500">
                          {schedule.scheduled_time} {schedule.is_recurring ? `(${schedule.recurrence_interval})` : "(once)"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={schedule.is_active ? "active" : "paused"} />
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
