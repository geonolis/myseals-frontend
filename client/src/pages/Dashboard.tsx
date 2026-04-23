/**
 * mySeals — Dashboard Page
 * Overview with KPI cards, seal status distribution chart,
 * and recent activity feed.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import SealStatusBadge from "@/components/SealStatusBadge";
import SealNumberBadge from "@/components/SealNumberBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sealsApi, stockMovementsApi } from "@/lib/api";
import {
  MOCK_STATS,
  MOCK_SEALS,
  MOCK_RECENT_MOVEMENTS,
  MOVEMENT_TYPE_LABELS,
  timeAgo,
} from "@/lib/utils";
import type { SealStatus } from "@/lib/types";
import {
  Tag,
  Package,
  Users,
  Building2,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const content = (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {label}
            </p>
            <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              {value.toLocaleString()}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// ─── Status Distribution Chart ────────────────────────────────────────────────

const CHART_DATA = [
  { name: "In Stock", value: MOCK_STATS.inStock, color: "#3b82f6" },
  { name: "Assigned", value: MOCK_STATS.assigned, color: "#6366f1" },
  { name: "In Use", value: MOCK_STATS.inUse, color: "#f59e0b" },
  { name: "Returned", value: MOCK_STATS.returned, color: "#10b981" },
  { name: "Lost", value: MOCK_STATS.lost, color: "#ef4444" },
];

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [recentSeals, setRecentSeals] = useState(MOCK_SEALS);
  const [recentMovements, setRecentMovements] = useState(MOCK_RECENT_MOVEMENTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Try to load real data; fall back to mock on error
    setLoading(true);
    Promise.all([sealsApi.getAll(), stockMovementsApi.getAll()])
      .then(([sealsRes, movementsRes]) => {
        if (sealsRes.data?.length) setRecentSeals(sealsRes.data.slice(0, 5));
        if (movementsRes.data?.length) setRecentMovements(movementsRes.data.slice(0, 5));
      })
      .catch(() => {
        // Keep mock data
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
              Operations Overview
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Real-time customs seal management dashboard
            </p>
          </div>
          <Link href="/seals">
            <Button size="sm" className="gap-2">
              <Tag className="w-4 h-4" />
              Manage Seals
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Seals"
            value={MOCK_STATS.totalSeals}
            icon={Tag}
            color="bg-blue-100 text-blue-700"
            href="/seals"
          />
          <StatCard
            label="In Stock"
            value={MOCK_STATS.inStock}
            icon={CheckCircle2}
            color="bg-emerald-100 text-emerald-700"
            href="/seals"
          />
          <StatCard
            label="In Use"
            value={MOCK_STATS.inUse}
            icon={TrendingUp}
            color="bg-amber-100 text-amber-700"
            href="/usage"
          />
          <StatCard
            label="Lost / Damaged"
            value={MOCK_STATS.lost}
            icon={AlertTriangle}
            color="bg-red-100 text-red-700"
            href="/seals"
          />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Batches" value={MOCK_STATS.totalBatches} icon={Package} color="bg-violet-100 text-violet-700" href="/batches" />
          <StatCard label="Users" value={MOCK_STATS.totalUsers} icon={Users} color="bg-sky-100 text-sky-700" href="/users" />
          <StatCard label="Offices" value={MOCK_STATS.totalOffices} icon={Building2} color="bg-orange-100 text-orange-700" href="/offices" />
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status distribution */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Seal Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={CHART_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CHART_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [value.toLocaleString(), ""]}
                    contentStyle={{ fontSize: 12 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span style={{ fontSize: 11 }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent seals */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Recent Seals
              </CardTitle>
              <Link href="/seals">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                  View all <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Seal No.</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Office</th>
                    <th className="text-left">Assigned To</th>
                    <th className="text-left">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSeals.map((seal) => (
                    <tr key={seal.sealId}>
                      <td>
                        <SealNumberBadge number={seal.sealNumber} />
                      </td>
                      <td>
                        <SealStatusBadge status={seal.currentStatus as SealStatus} />
                      </td>
                      <td className="text-sm text-muted-foreground">{seal.currentOfficeName}</td>
                      <td className="text-sm">{seal.assignedToUserName ?? "—"}</td>
                      <td className="text-xs text-muted-foreground">{timeAgo(seal.lastUpdatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Recent movements */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
              Recent Stock Movements
            </CardTitle>
            <Link href="/stock-movements">
              <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                View all <ChevronRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th className="text-left">Seal No.</th>
                  <th className="text-left">Movement Type</th>
                  <th className="text-left">From</th>
                  <th className="text-left">To</th>
                  <th className="text-left">By</th>
                  <th className="text-left">When</th>
                </tr>
              </thead>
              <tbody>
                {recentMovements.map((m: any) => (
                  <tr key={m.movementId}>
                    <td><SealNumberBadge number={m.sealNumber} /></td>
                    <td>
                      <span className="flex items-center gap-1.5 text-sm">
                        <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                        {MOVEMENT_TYPE_LABELS[m.movementType as keyof typeof MOVEMENT_TYPE_LABELS]}
                      </span>
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {m.fromOfficeName ?? m.fromUserName ?? "—"}
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {m.toOfficeName ?? m.toUserName ?? "—"}
                    </td>
                    <td className="text-sm">{m.movedByUserName}</td>
                    <td className="text-xs text-muted-foreground">{timeAgo(m.movementDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
