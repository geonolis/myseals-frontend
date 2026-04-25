/**
 * mySeals — Dashboard Page
 * Overview with KPI cards, seal status distribution chart,
 * and recent activity feed. All data is fetched from the live backend.
 */

import { useState, useEffect } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import SealStatusBadge from "@/components/SealStatusBadge";
import SealNumberBadge from "@/components/SealNumberBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sealsApi, stockMovementsApi, usersApi, officesApi, sealBatchesApi } from "@/lib/api";
import { MOVEMENT_TYPE_LABELS, timeAgo } from "@/lib/utils";
import type { SealStatus } from "@/lib/types";
import {
  Tag, Package, Users, Building2, TrendingUp,
  AlertTriangle, CheckCircle2, ArrowRightLeft,
  ChevronRight, RefreshCw, WifiOff,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color, href, loading,
}: {
  label: string;
  value: number | null;
  icon: React.ElementType;
  color: string;
  href?: string;
  loading?: boolean;
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
            {loading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
            ) : (
              <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Sora', sans-serif" }}>
                {value !== null ? value.toLocaleString() : "—"}
              </p>
            )}
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function Dashboard() {
  // KPI counts
  const [totalSeals, setTotalSeals] = useState<number | null>(null);
  const [inStock, setInStock] = useState<number | null>(null);
  const [inUse, setInUse] = useState<number | null>(null);
  const [lost, setLost] = useState<number | null>(null);
  const [totalBatches, setTotalBatches] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalOffices, setTotalOffices] = useState<number | null>(null);

  // Table data
  const [recentSeals, setRecentSeals] = useState<any[]>([]);
  const [recentMovements, setRecentMovements] = useState<any[]>([]);

  // Chart data derived from seals
  const [chartData, setChartData] = useState<{ name: string; value: number; color: string }[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      sealsApi.getAll(),
      stockMovementsApi.getAll(),
      sealBatchesApi.getAll(),
      usersApi.getAll(),
      officesApi.getAll(),
    ])
      .then(([sealsRes, movementsRes, batchesRes, usersRes, officesRes]) => {
        const seals: any[] = sealsRes.data ?? [];
        const movements: any[] = movementsRes.data ?? [];

        // KPI calculations from seal list
        setTotalSeals(seals.length);
        setInStock(seals.filter((s) => s.currentStatus === "IN_STOCK").length);
        setInUse(seals.filter((s) => s.currentStatus === "IN_USE").length);
        setLost(seals.filter((s) => s.currentStatus === "LOST" || s.currentStatus === "DAMAGED").length);
        setTotalBatches((batchesRes.data ?? []).length);
        setTotalUsers((usersRes.data ?? []).length);
        setTotalOffices((officesRes.data ?? []).length);

        // Recent tables
        setRecentSeals(seals.slice(0, 5));
        setRecentMovements(movements.slice(0, 5));

        // Chart data
        const statusCounts: Record<string, number> = {};
        seals.forEach((s) => {
          statusCounts[s.currentStatus] = (statusCounts[s.currentStatus] ?? 0) + 1;
        });
        const COLORS: Record<string, string> = {
          IN_STOCK: "#3b82f6",
          ASSIGNED: "#6366f1",
          IN_USE: "#f59e0b",
          RETURNED: "#10b981",
          LOST: "#ef4444",
          DAMAGED: "#f97316",
          REGISTERED: "#94a3b8",
          CANCELLED: "#cbd5e1",
        };
        const LABELS: Record<string, string> = {
          IN_STOCK: "In Stock", ASSIGNED: "Assigned", IN_USE: "In Use",
          RETURNED: "Returned", LOST: "Lost", DAMAGED: "Damaged",
          REGISTERED: "Registered", CANCELLED: "Cancelled",
        };
        setChartData(
          Object.entries(statusCounts)
            .filter(([, v]) => v > 0)
            .map(([k, v]) => ({ name: LABELS[k] ?? k, value: v, color: COLORS[k] ?? "#94a3b8" }))
        );
      })
      .catch((err) => {
        setError(err.message ?? "Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadAll(); }, []);

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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadAll} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/seals">
              <Button size="sm" className="gap-2">
                <Tag className="w-4 h-4" />
                Manage Seals
              </Button>
            </Link>
          </div>
        </div>

        {/* Loading notice — Render free tier cold start can take 50s+ */}
        {loading && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            <RefreshCw className="w-4 h-4 flex-shrink-0 animate-spin" />
            <span>Connecting to backend… The server may take up to 60 seconds to wake up on the free tier.</span>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            <WifiOff className="w-4 h-4 flex-shrink-0" />
            <span>{error}. Check that the backend is running and your API URL is configured correctly.</span>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Seals" value={totalSeals} icon={Tag} color="bg-blue-100 text-blue-700" href="/seals" loading={loading} />
          <StatCard label="In Stock" value={inStock} icon={CheckCircle2} color="bg-emerald-100 text-emerald-700" href="/seals" loading={loading} />
          <StatCard label="In Use" value={inUse} icon={TrendingUp} color="bg-amber-100 text-amber-700" href="/usage" loading={loading} />
          <StatCard label="Lost / Damaged" value={lost} icon={AlertTriangle} color="bg-red-100 text-red-700" href="/seals" loading={loading} />
        </div>

        {/* Secondary stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Batches" value={totalBatches} icon={Package} color="bg-violet-100 text-violet-700" href="/batches" loading={loading} />
          <StatCard label="Users" value={totalUsers} icon={Users} color="bg-sky-100 text-sky-700" href="/users" loading={loading} />
          <StatCard label="Offices" value={totalOffices} icon={Building2} color="bg-orange-100 text-orange-700" href="/offices" loading={loading} />
        </div>

        {/* Charts + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status distribution chart */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold" style={{ fontFamily: "'Sora', sans-serif" }}>
                Seal Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[220px] flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                  No seal data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value.toLocaleString(), ""]} contentStyle={{ fontSize: 12 }} />
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 11 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
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
              {loading ? (
                <div className="py-8 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : recentSeals.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No seals registered yet. <Link href="/seals" className="text-primary underline">Register the first seal.</Link>
                </div>
              ) : (
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
                        <td><SealNumberBadge number={seal.sealNumber} /></td>
                        <td><SealStatusBadge status={seal.currentStatus as SealStatus} /></td>
                        <td className="text-sm text-muted-foreground">{seal.currentOfficeName ?? "—"}</td>
                        <td className="text-sm">{seal.assignedToUserName ?? "—"}</td>
                        <td className="text-xs text-muted-foreground">{timeAgo(seal.lastUpdatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent stock movements */}
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
            {loading ? (
              <div className="py-8 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentMovements.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">
                No stock movements recorded yet.
              </div>
            ) : (
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
                          {MOVEMENT_TYPE_LABELS[m.movementType as keyof typeof MOVEMENT_TYPE_LABELS] ?? m.movementType}
                        </span>
                      </td>
                      <td className="text-sm text-muted-foreground">{m.fromOfficeName ?? m.fromUserName ?? "—"}</td>
                      <td className="text-sm text-muted-foreground">{m.toOfficeName ?? m.toUserName ?? "—"}</td>
                      <td className="text-sm">{m.movedByUserName ?? "—"}</td>
                      <td className="text-xs text-muted-foreground">{timeAgo(m.movementDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
