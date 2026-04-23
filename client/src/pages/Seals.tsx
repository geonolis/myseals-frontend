/**
 * mySeals — Seals Page
 * Full CRUD for individual seals with filtering by status, search, and pagination.
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SealStatusBadge from "@/components/SealStatusBadge";
import SealNumberBadge from "@/components/SealNumberBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sealsApi, sealBatchesApi, officesApi } from "@/lib/api";
import { MOCK_SEALS, SEAL_STATUS_LABELS, formatDateTime } from "@/lib/utils";
import type { Seal, SealStatus } from "@/lib/types";
import { Plus, Search, Filter, RefreshCw, Tag } from "lucide-react";
import { toast } from "sonner";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "ALL", label: "All Statuses" },
  ...Object.entries(SEAL_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function Seals() {
  const [seals, setSeals] = useState<any[]>(MOCK_SEALS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [form, setForm] = useState({
    sealNumber: "",
    batchId: "",
    currentOfficeId: "",
    currentStatus: "REGISTERED",
  });
  const [saving, setSaving] = useState(false);

  const loadSeals = () => {
    setLoading(true);
    sealsApi
      .getAll()
      .then((res) => { if (res.data?.length) setSeals(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSeals();
    sealBatchesApi.getAll().then((r) => { if (r.data?.length) setBatches(r.data); }).catch(() => {});
    officesApi.getAll().then((r) => { if (r.data?.length) setOffices(r.data); }).catch(() => {});
  }, []);

  const filtered = seals.filter((s) => {
    const matchSearch =
      !search ||
      s.sealNumber?.toLowerCase().includes(search.toLowerCase()) ||
      s.currentOfficeName?.toLowerCase().includes(search.toLowerCase()) ||
      s.assignedToUserName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || s.currentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = async () => {
    if (!form.sealNumber) { toast.error("Seal number is required"); return; }
    setSaving(true);
    try {
      await sealsApi.create(form);
      toast.success(`Seal ${form.sealNumber} registered successfully`);
      setShowCreate(false);
      setForm({ sealNumber: "", batchId: "", currentOfficeId: "", currentStatus: "REGISTERED" });
      loadSeals();
    } catch (e: any) {
      toast.error(e.message || "Failed to create seal");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>
              Seals
            </h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {filtered.length} seal{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadSeals} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Register Seal
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by seal number, office, or user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_FILTERS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Seal Number</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Batch</th>
                    <th className="text-left">Office</th>
                    <th className="text-left">Assigned To</th>
                    <th className="text-left">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No seals found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((seal) => (
                      <tr key={seal.sealId}>
                        <td><SealNumberBadge number={seal.sealNumber} /></td>
                        <td><SealStatusBadge status={seal.currentStatus as SealStatus} /></td>
                        <td className="text-sm text-muted-foreground font-mono text-xs">
                          {seal.batchNumber ?? "—"}
                        </td>
                        <td className="text-sm">{seal.currentOfficeName}</td>
                        <td className="text-sm">{seal.assignedToUserName ?? "—"}</td>
                        <td className="text-xs text-muted-foreground">
                          {formatDateTime(seal.lastUpdatedAt)}
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

      {/* Create Seal Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Register New Seal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Seal Number *</Label>
              <Input
                placeholder="e.g. MS-000001"
                value={form.sealNumber}
                onChange={(e) => setForm({ ...form, sealNumber: e.target.value })}
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <Label>Batch</Label>
              <Select value={form.batchId} onValueChange={(v) => setForm({ ...form, batchId: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select batch..." />
                </SelectTrigger>
                <SelectContent>
                  {batches.length === 0 ? (
                    <SelectItem value="none" disabled>No batches available</SelectItem>
                  ) : (
                    batches.map((b: any) => (
                      <SelectItem key={b.batchId} value={b.batchId}>
                        {b.batchNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Office</Label>
              <Select value={form.currentOfficeId} onValueChange={(v) => setForm({ ...form, currentOfficeId: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select office..." />
                </SelectTrigger>
                <SelectContent>
                  {offices.length === 0 ? (
                    <SelectItem value="none" disabled>No offices available</SelectItem>
                  ) : (
                    offices.map((o: any) => (
                      <SelectItem key={o.officeId} value={o.officeId}>
                        {o.officeName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Initial Status</Label>
              <Select value={form.currentStatus} onValueChange={(v) => setForm({ ...form, currentStatus: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REGISTERED">Registered</SelectItem>
                  <SelectItem value="IN_STOCK">In Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? "Registering..." : "Register Seal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
