/**
 * mySeals — Seal Usage Page
 * View and register seal usage records from field employees.
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SealNumberBadge from "@/components/SealNumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { sealUsageApi, sealsApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Plus, FileText, RefreshCw, Search, MapPin, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const MOCK_USAGE = [
  { usageId: "1", sealNumber: "MS-000042", usedByUserName: "Carlos Silva", usageLocation: "Lisbon Port — Container Terminal A", documentReference: "TIR-2024-00123", notes: "Transit to Spain", usedAt: new Date(Date.now() - 3600000).toISOString(), latitude: 38.7169, longitude: -9.1399 },
  { usageId: "2", sealNumber: "MS-000038", usedByUserName: "Ana Ferreira", usageLocation: "Lisbon Port — Warehouse 3", documentReference: "TIR-2024-00124", notes: null, usedAt: new Date(Date.now() - 7200000).toISOString(), latitude: null, longitude: null },
  { usageId: "3", sealNumber: "MS-000029", usedByUserName: "João Mendes", usageLocation: "Porto — Customs Gate 2", documentReference: "TIR-2024-00119", notes: "Goods from Germany", usedAt: new Date(Date.now() - 86400000).toISOString(), latitude: 41.1579, longitude: -8.6291 },
];

export default function SealUsage() {
  const [usage, setUsage] = useState<any[]>(MOCK_USAGE);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seals, setSeals] = useState<any[]>([]);
  const [form, setForm] = useState({ sealId: "", usageLocation: "", documentReference: "", notes: "" });

  const load = () => {
    setLoading(true);
    sealUsageApi.getAll().then((r) => { if (r.data?.length) setUsage(r.data); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    sealsApi.getAll({ status: "ASSIGNED" }).then((r) => { if (r.data?.length) setSeals(r.data); }).catch(() => {});
  }, []);

  const filtered = usage.filter((u) =>
    !search ||
    u.sealNumber?.toLowerCase().includes(search.toLowerCase()) ||
    u.usageLocation?.toLowerCase().includes(search.toLowerCase()) ||
    u.documentReference?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.sealId || !form.usageLocation) { toast.error("Seal and location are required"); return; }
    setSaving(true);
    try {
      await sealUsageApi.create(form);
      toast.success("Usage record registered");
      setShowCreate(false);
      setForm({ sealId: "", usageLocation: "", documentReference: "", notes: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to register usage");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Seal Usage</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} usage record{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Register Usage
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by seal, location or document ref..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Seal</th>
                    <th className="text-left">Used By</th>
                    <th className="text-left">Location</th>
                    <th className="text-left">Document Ref.</th>
                    <th className="text-left">Notes</th>
                    <th className="text-left">Used At</th>
                    <th className="text-left">GPS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-muted-foreground"><FileText className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No usage records found</p></td></tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.usageId}>
                        <td><SealNumberBadge number={u.sealNumber} /></td>
                        <td className="text-sm font-medium">{u.usedByUserName}</td>
                        <td className="text-sm">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            {u.usageLocation}
                          </span>
                        </td>
                        <td className="text-xs font-mono text-muted-foreground">{u.documentReference ?? "—"}</td>
                        <td className="text-sm text-muted-foreground max-w-xs truncate">{u.notes ?? "—"}</td>
                        <td className="text-xs text-muted-foreground">{formatDateTime(u.usedAt)}</td>
                        <td>
                          {u.latitude && u.longitude ? (
                            <a
                              href={`https://maps.google.com/?q=${u.latitude},${u.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Map
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Register Seal Usage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Seal *</Label>
              <Select value={form.sealId} onValueChange={(v) => setForm({ ...form, sealId: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select seal..." />
                </SelectTrigger>
                <SelectContent>
                  {seals.length === 0 ? (
                    <SelectItem value="none" disabled>No assigned seals available</SelectItem>
                  ) : (
                    seals.map((s: any) => (
                      <SelectItem key={s.sealId} value={s.sealId}>{s.sealNumber}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Usage Location *</Label>
              <Input placeholder="e.g. Lisbon Port — Terminal A" value={form.usageLocation} onChange={(e) => setForm({ ...form, usageLocation: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>Document Reference</Label>
              <Input placeholder="e.g. TIR-2024-00125" value={form.documentReference} onChange={(e) => setForm({ ...form, documentReference: e.target.value })} className="mt-1 font-mono" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Register Usage"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
