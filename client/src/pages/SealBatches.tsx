/**
 * mySeals — Seal Batches Page
 * Register and manage incoming batches of seals from manufacturers.
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
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
import { sealBatchesApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Package, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";

const MOCK_BATCHES = [
  { batchId: "1", batchNumber: "BATCH-2024-001", manufacturer: "SealCo Inc.", startSealNumber: "MS-000001", endSealNumber: "MS-001000", quantity: 1000, receivedDate: "2024-01-15", registeredByUserName: "Admin User", createdAt: new Date(Date.now() - 7776000000).toISOString() },
  { batchId: "2", batchNumber: "BATCH-2024-002", manufacturer: "MetalSeal Ltd.", startSealNumber: "MS-001001", endSealNumber: "MS-001500", quantity: 500, receivedDate: "2024-03-20", registeredByUserName: "Admin User", createdAt: new Date(Date.now() - 5184000000).toISOString() },
  { batchId: "3", batchNumber: "BATCH-2024-003", manufacturer: "SealCo Inc.", startSealNumber: "MS-001501", endSealNumber: "MS-002500", quantity: 1000, receivedDate: "2024-06-10", registeredByUserName: "Manager", createdAt: new Date(Date.now() - 2592000000).toISOString() },
];

export default function SealBatches() {
  const [batches, setBatches] = useState<any[]>(MOCK_BATCHES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    manufacturer: "",
    batchNumber: "",
    startSealNumber: "",
    endSealNumber: "",
    quantity: "",
    receivedDate: "",
  });

  const loadBatches = () => {
    setLoading(true);
    sealBatchesApi.getAll()
      .then((r) => { if (r.data?.length) setBatches(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadBatches(); }, []);

  const filtered = batches.filter((b) =>
    !search ||
    b.batchNumber?.toLowerCase().includes(search.toLowerCase()) ||
    b.manufacturer?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.batchNumber || !form.manufacturer) {
      toast.error("Batch number and manufacturer are required");
      return;
    }
    setSaving(true);
    try {
      await sealBatchesApi.create({ ...form, quantity: Number(form.quantity) });
      toast.success(`Batch ${form.batchNumber} registered`);
      setShowCreate(false);
      setForm({ manufacturer: "", batchNumber: "", startSealNumber: "", endSealNumber: "", quantity: "", receivedDate: "" });
      loadBatches();
    } catch (e: any) {
      toast.error(e.message || "Failed to create batch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Seal Batches</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} batch{filtered.length !== 1 ? "es" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadBatches} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              New Batch
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by batch number or manufacturer..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">Batch Number</th>
                    <th className="text-left">Manufacturer</th>
                    <th className="text-left">Range</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-left">Received</th>
                    <th className="text-left">Registered By</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-muted-foreground">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No batches found</p>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((b) => (
                      <tr key={b.batchId}>
                        <td>
                          <span className="font-mono text-xs font-semibold text-foreground bg-muted px-2 py-1 rounded">
                            {b.batchNumber}
                          </span>
                        </td>
                        <td className="text-sm">{b.manufacturer}</td>
                        <td className="text-xs font-mono text-muted-foreground">
                          {b.startSealNumber} → {b.endSealNumber}
                        </td>
                        <td className="text-sm text-right font-semibold">{b.quantity?.toLocaleString()}</td>
                        <td className="text-sm">{formatDate(b.receivedDate)}</td>
                        <td className="text-sm text-muted-foreground">{b.registeredByUserName}</td>
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
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Register New Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Batch Number *</Label>
                <Input placeholder="BATCH-2024-004" value={form.batchNumber} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} className="mt-1 font-mono" />
              </div>
              <div>
                <Label>Manufacturer *</Label>
                <Input placeholder="SealCo Inc." value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Seal No.</Label>
                <Input placeholder="MS-002501" value={form.startSealNumber} onChange={(e) => setForm({ ...form, startSealNumber: e.target.value })} className="mt-1 font-mono" />
              </div>
              <div>
                <Label>End Seal No.</Label>
                <Input placeholder="MS-003500" value={form.endSealNumber} onChange={(e) => setForm({ ...form, endSealNumber: e.target.value })} className="mt-1 font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity</Label>
                <Input type="number" placeholder="1000" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Received Date</Label>
                <Input type="date" value={form.receivedDate} onChange={(e) => setForm({ ...form, receivedDate: e.target.value })} className="mt-1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Register Batch"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
