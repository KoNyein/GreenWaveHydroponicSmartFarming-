"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, StatCard } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate } from "@/lib/utils";
import { useSettingsStore } from "@/lib/store";
import { t } from "@/lib/translations";
import type { Profile } from "@/types/database";
import { Users, UserPlus, Shield, Search, Mail, Phone } from "lucide-react";

const mockMembers: Profile[] = [
  { id: "1", email: "admin@greenwave.farm", full_name: "Admin User", role: "admin", avatar_url: null, phone: "+1234567890", is_active: true, affiliate_code: "GW-ADMIN", created_at: "2025-01-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: "2", email: "mike@greenwave.farm", full_name: "Mike Johnson", role: "manager", avatar_url: null, phone: "+1234567891", is_active: true, affiliate_code: "GW-MIKE", created_at: "2025-02-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: "3", email: "sarah@greenwave.farm", full_name: "Sarah Williams", role: "staff", avatar_url: null, phone: "+1234567892", is_active: true, affiliate_code: null, created_at: "2025-03-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: "4", email: "john@example.com", full_name: "John Doe", role: "member", avatar_url: null, phone: "+1234567893", is_active: true, affiliate_code: "GW-JOHN", created_at: "2025-04-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
  { id: "5", email: "jane@example.com", full_name: "Jane Smith", role: "member", avatar_url: null, phone: null, is_active: false, affiliate_code: null, created_at: "2025-05-01T00:00:00Z", updated_at: "2025-06-01T00:00:00Z" },
];

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-800",
  manager: "bg-blue-100 text-blue-800",
  staff: "bg-yellow-100 text-yellow-800",
  member: "bg-gray-100 text-gray-800",
};

export default function MembersPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockMembers.filter((m) => {
    const matchSearch =
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  const activeMembers = mockMembers.filter((m) => m.is_active);
  const admins = mockMembers.filter((m) => m.role === "admin" || m.role === "manager");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{tr("members.title")}</h1>
            <p className="text-muted text-sm mt-1">{tr("members.subtitle")}</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition">
            <UserPlus className="w-4 h-4" /> {tr("members.addMember")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label={tr("members.totalMembers")} value={mockMembers.length} icon={<Users className="w-5 h-5" />} />
          <StatCard label={tr("members.activeMembers")} value={activeMembers.length} icon={<Users className="w-5 h-5" />} color="bg-green-600" />
          <StatCard label={tr("members.adminManagers")} value={admins.length} icon={<Shield className="w-5 h-5" />} color="bg-blue-500" />
        </div>

        <Card>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={tr("members.searchMembers")}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              {["all", "admin", "manager", "staff", "member"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-2 rounded-lg text-sm capitalize ${
                    roleFilter === role ? "bg-primary text-white" : "bg-white border border-gray-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {member.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.full_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Mail className="w-3 h-3" /> {member.email}
                      </span>
                      {member.phone && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Phone className="w-3 h-3" /> {member.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${roleColors[member.role]}`}>
                    {member.role}
                  </span>
                  <StatusBadge status={member.is_active ? "active" : "inactive"} />
                  <span className="text-xs text-muted">{tr("members.joined")} {formatDate(member.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
