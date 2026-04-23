/**
 * mySeals — Stock Movements Page
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SealNumberBadge from "@/components/SealNumberBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { stockMovementsApi, sealsApi, officesApi, usersApi } from "@/lib/api";
import { formatDateTime, MOVEMENT_TYPE_LABELS } from "@/lib/utils";
import { Plus, ArrowRightLeft, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import type { MovementType } from "@/lib/types";

const MOCK_MOVEMENTS = [
  { movementId: "1", sealNumber: "MS-000042", movementType: "ASSIGNED_TO_USER", fromOfficeName: "Headquarters", toUserName: "Carlos Silva", toOfficeName: null, movedByUserName: "Admin", notes: null, movementDate: new Date(Date.now() - 3600000).toISOString() },
  { movementId: "2", sealNumber: "MS-000039", movementType: "TRANSFER_IN", fromOfficeName: "Headquarters", toOfficeName: "Lisbon Port Office", toUserName: null, movedByUserName: "Admin", notes: "Quarterly distribution", movementDate: new Date(Date.now() - 7200000).toISOString() },
  { movementId: "3", sealNumber: "MS-000031", movementType: "RETURNED_FROM_USER", fromUserName: "Ana Ferreira", toOfficeName: "Porto Office", toUserName: null, movedByUserName: "Manager", notes: null, movementDate: new Date(Date.now() - 14400000).toISOString() },
  { movementId: "4", sealNumber: "MS-000010", movementType: "RECEIVED", fromOfficeName: null, toOfficeName: "Headquarters", toUserName: null, movedByUserName: "Admin", notes: "BATCH-2024-003", movementDate: new Date(Date.now() - 2592000000).toISOString() },
];

const MOVEMENT_TYPES: MovementType[] = ["RECEIVED","TRANSFER_OUT","TRANSFER_IN","ASSIGNED_TO_USER","RETURNED_FROM_USER","USED","LOST","DAMAGED","CANCELLED"];

export default function StockMovements() {
  const [movements, setMovements] = useState<any[]>(MOCK_MOVEMENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seals, setSeals] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ sealId: "", movementType: "TRANSFER_OUT", fromOfficeId: "", toOfficeId: "", toUserId: "", notes: "" });

  const load = () => {
    setLoading(true);
    stockMovementsApi.getAll().then((r) => { if (r.data?.length) setMovements(r.data); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    sealsApi.getAll().then((r) => { if (r.data?.length) setSeals(r.data); }).catch(() => {});
    officesApi.getAll().then((r) => { if (r.data?.length) setOffices(r.data); }).catch(() => {});
    usersApi.getAll().then((r) => { if (r.data?.length) setUsers(r.data); }).catch(() => {});
  }, []);

  const filtered = movements.filter((m) =>
    !search ||
    m.sealNumber?.toLowerCase().includes(search.toLowerCase()) ||
    m.movementType?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.sealId || !form.movementType) { toast.error("Seal and movement type are required"); return; }
    setSaving(true);
    try {
      await stockMovementsApi.create(form);
      toast.success("Stock movement recorded");
      setShowCreate(false);
      setForm({ sealId: "", movementType: "TRANSFER_OUT", fromOfficeId: "", toOfficeId: "", toUserId: "", notes: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to record movement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Stock Movements</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} movement{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Record Movement
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by seal number or movement type..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                    <th className="text-left">Type</th>
                    <th className="text-left">From</th>
                    <th className="text-left">To</th>
                    <th className="text-left">By</th>
                    <th className="text-left">Notes</th>
                    <th className="text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-muted-foreground"><ArrowRightLeft className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No movements found</p></td></tr>
                  ) : (
                    filtered.map((m) => (
                      <tr key={m.movementId}>
                        <td><SealNumberBadge number={m.sealNumber} /></td>
                        <td>
                          <span className="flex items-center gap-1.5 text-sm">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground" />
                            {MOVEMENT_TYPE_LABELS[m.movementType as MovementType]}
                          </span>
                        </td>
                        <td className="text-sm text-muted-foreground">{m.fromOfficeName ?? m.fromUserName ?? "—"}</td>
                        <td className="text-sm text-muted-foreground">{m.toOfficeName ?? m.toUserName ?? "—"}</td>
                        <td className="text-sm">{m.movedByUserName}</td>
                        <td className="text-sm text-muted-foreground max-w-xs truncate">{m.notes ?? "—"}</td>
                        <td className="text-xs text-muted-foreground">{formatDateTime(m.movementDate)}</td>
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
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Record Stock Movement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Seal *</Label>
              <Select value={form.sealId} onValueChange={(v) => setForm({ ...form, sealId: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select seal..." /></SelectTrigger>
                <SelectContent>
                  {seals.length === 0 ? <SelectItem value="none" disabled>No seals</SelectItem> : seals.map((s: any) => <SelectItem key={s.sealId} value={s.sealId}>{s.sealNumber}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Movement Type *</Label>
              <Select value={form.movementType} onValueChange={(v) => setForm({ ...form, movementType: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MOVEMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{MOVEMENT_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>From Office</Label>
                <Select value={form.fromOfficeId} onValueChange={(v) => setForm({ ...form, fromOfficeId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {offices.map((o: any) => <SelectItem key={o.officeId} value={o.officeId}>{o.officeName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>To Office</Label>
                <Select value={form.toOfficeId} onValueChange={(v) => setForm({ ...form, toOfficeId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {offices.map((o: any) => <SelectItem key={o.officeId} value={o.officeId}>{o.officeName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Input placeholder="Optional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Record Movement"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
