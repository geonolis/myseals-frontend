/**
 * mySeals — Audit Logs Page
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auditLogsApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Shield, RefreshCw, Search } from "lucide-react";

const MOCK_LOGS = [
  { auditId: "1", userName: "Admin User", actionType: "CREATE", entityType: "Seal", entityId: "MS-000042", ipAddress: "192.168.1.10", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { auditId: "2", userName: "Admin User", actionType: "UPDATE", entityType: "SealAssignment", entityId: "assign-001", ipAddress: "192.168.1.10", timestamp: new Date(Date.now() - 7200000).toISOString() },
  { auditId: "3", userName: "Carlos Silva", actionType: "CREATE", entityType: "SealUsage", entityId: "usage-001", ipAddress: "10.0.0.5", timestamp: new Date(Date.now() - 10800000).toISOString() },
  { auditId: "4", userName: "Manager", actionType: "CREATE", entityType: "StockMovement", entityId: "move-001", ipAddress: "192.168.1.20", timestamp: new Date(Date.now() - 14400000).toISOString() },
  { auditId: "5", userName: "Admin User", actionType: "CREATE", entityType: "SealBatch", entityId: "BATCH-2024-003", ipAddress: "192.168.1.10", timestamp: new Date(Date.now() - 2592000000).toISOString() },
];

const ACTION_COLORS: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  VIEW: "bg-slate-100 text-slate-700",
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>(MOCK_LOGS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    auditLogsApi.getAll().then((r) => { if (r.data?.length) setLogs(r.data); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter((l) =>
    !search ||
    l.userName?.toLowerCase().includes(search.toLowerCase()) ||
    l.entityType?.toLowerCase().includes(search.toLowerCase()) ||
    l.entityId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Audit Logs</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              Immutable record of all system actions — {filtered.length} entries
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by user, entity type or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Timestamp</th>
                    <th className="text-left">User</th>
                    <th className="text-left">Action</th>
                    <th className="text-left">Entity Type</th>
                    <th className="text-left">Entity ID</th>
                    <th className="text-left">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground"><Shield className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No audit logs found</p></td></tr>
                  ) : (
                    filtered.map((l) => (
                      <tr key={l.auditId}>
                        <td className="text-xs text-muted-foreground font-mono">{formatDateTime(l.timestamp)}</td>
                        <td className="text-sm font-medium">{l.userName}</td>
                        <td>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ACTION_COLORS[l.actionType] ?? "bg-gray-100 text-gray-700"}`}>
                            {l.actionType}
                          </span>
                        </td>
                        <td className="text-sm">{l.entityType}</td>
                        <td className="text-xs font-mono text-muted-foreground">{l.entityId}</td>
                        <td className="text-xs font-mono text-muted-foreground">{l.ipAddress}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
