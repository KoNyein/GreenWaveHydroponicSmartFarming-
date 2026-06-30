"use client";

import Link from "next/link";
import { useState } from "react";
import { useSettingsStore } from "@/lib/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { DataTable } from "@/components/ui/DataTable";
import { formatDateTime } from "@/lib/utils";
import { t } from "@/lib/translations";
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  ShieldCheck,
  XCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminUsersPage() {
  const { locale } = useSettingsStore();
  const tr = (key: string) => t(key, locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock user data
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', joined: '2024-01-15', lastActive: '2024-06-20', orders: 45, spent: 1250.00 },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'manager', status: 'active', joined: '2024-02-20', lastActive: '2024-06-19', orders: 32, spent: 890.50 },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'staff', status: 'active', joined: '2024-03-10', lastActive: '2024-06-18', orders: 18, spent: 450.75 },
    { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'member', status: 'pending', joined: '2024-06-01', lastActive: '-', orders: 0, spent: 0 },
    { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'member', status: 'suspended', joined: '2024-05-15', lastActive: '2024-05-20', orders: 5, spent: 120.00 },
    { id: '6', name: 'Diana Miller', email: 'diana@example.com', role: 'member', status: 'active', joined: '2024-04-01', lastActive: '2024-06-20', orders: 22, spent: 675.30 },
  ];

  const roleOptions = ['all', 'admin', 'manager', 'staff', 'member'];
  const statusOptions = ['all', 'active', 'pending', 'suspended', 'banned'];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const columns = [
    {
      header: tr("adminUsers.name"),
      accessor: 'name',
      cell: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-muted/20 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      header: tr("adminUsers.email"),
      accessor: 'email',
      cell: (row: any) => <span className="text-sm text-muted">{row.email}</span>,
    },
    {
      header: tr("adminUsers.role"),
      accessor: 'role',
      cell: (row: any) => (
        <Badge variant={row.role === 'admin' ? 'default' : row.role === 'manager' ? 'secondary' : 'outline'}>
          {tr(`roles.${row.role}`)}
        </Badge>
      ),
    },
    {
      header: tr("adminUsers.status"),
      accessor: 'status',
      cell: (row: any) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'destructive'}>
          {tr(`status.${row.status}`)}
        </Badge>
      ),
    },
    {
      header: tr("adminUsers.joined"),
      accessor: 'joined',
      cell: (row: any) => <span className="text-sm text-muted">{formatDateTime(row.joined)}</span>,
    },
    {
      header: tr("adminUsers.lastActive"),
      accessor: 'lastActive',
      cell: (row: any) => <span className="text-sm text-muted">{row.lastActive === '-' ? '-' : formatDateTime(row.lastActive)}</span>,
    },
    {
      header: tr("adminUsers.orders"),
      accessor: 'orders',
      cell: (row: any) => <span className="font-medium">{row.orders}</span>,
    },
    {
      header: tr("adminUsers.actions"),
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="xs" asChild>
            <Link href={`/admin/users/${row.id}`}>
              <Eye className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="xs" asChild>
            <Link href={`/admin/users/${row.id}/edit`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="xs" className="text-red-500 hover:text-red-600">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{tr("adminUsers.title")}</h1>
          <p className="text-muted text-sm mt-1">{tr("adminUsers.subtitle")}</p>
        </div>
        <Button asChild size="sm" className="gap-2">
          <Link href="/admin/users/new">
            <Plus className="w-4 h-4" />
            {tr("adminUsers.addUser")}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <Input
                type="text"
                placeholder={tr("adminUsers.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={tr("adminUsers.roleFilter")} />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === 'all' ? tr("common.all") : tr(`roles.${role}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={tr("adminUsers.statusFilter")} />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === 'all' ? tr("common.all") : tr(`status.${status}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-muted">{tr("adminUsers.totalUsers")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-sm text-muted">{tr("adminUsers.activeUsers")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'pending').length}</p>
              <p className="text-sm text-muted">{tr("adminUsers.pendingUsers")}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{users.filter(u => u.status === 'suspended' || u.status === 'banned').length}</p>
              <p className="text-sm text-muted">{tr("adminUsers.restrictedUsers")}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card title={tr("adminUsers.usersList")}>
        <DataTable
          columns={columns}
          data={filteredUsers}
          keyExtractor={(row) => row.id}
          emptyMessage={tr("common.noResults")}
        />
      </Card>
    </div>
  );
}
