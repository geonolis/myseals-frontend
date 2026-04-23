/**
 * mySeals — Assignments Page
 * Manage seal assignments to users and offices.
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
import { assignmentsApi, sealsApi, usersApi, officesApi } from "@/lib/api";
import { formatDateTime } from "@/lib/utils";
import { Plus, ClipboardList, RefreshCw, Search, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

const MOCK_ASSIGNMENTS = [
  { assignmentId: "1", sealNumber: "MS-000042", assignedToUserName: "Carlos Silva", assignedToOfficeName: "Lisbon Port Office", assignedByUserName: "Admin", assignmentDate: new Date(Date.now() - 3600000).toISOString(), returnDate: null, status: "ACTIVE" },
  { assignmentId: "2", sealNumber: "MS-000043", assignedToUserName: "Ana Ferreira", assignedToOfficeName: "Lisbon Port Office", assignedByUserName: "Admin", assignmentDate: new Date(Date.now() - 7200000).toISOString(), returnDate: null, status: "ACTIVE" },
  { assignmentId: "3", sealNumber: "MS-000031", assignedToUserName: "João Mendes", assignedToOfficeName: "Porto Office", assignedByUserName: "Manager", assignmentDate: new Date(Date.now() - 172800000).toISOString(), returnDate: new Date(Date.now() - 86400000).toISOString(), status: "RETURNED" },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState<any[]>(MOCK_ASSIGNMENTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seals, setSeals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [form, setForm] = useState({ sealId: "", assignedToUserId: "", assignedToOfficeId: "" });

  const load = () => {
    setLoading(true);
    assignmentsApi.getAll().then((r) => { if (r.data?.length) setAssignments(r.data); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    sealsApi.getAll({ status: "IN_STOCK" }).then((r) => { if (r.data?.length) setSeals(r.data); }).catch(() => {});
    usersApi.getAll().then((r) => { if (r.data?.length) setUsers(r.data); }).catch(() => {});
    officesApi.getAll().then((r) => { if (r.data?.length) setOffices(r.data); }).catch(() => {});
  }, []);

  const filtered = assignments.filter((a) =>
    !search ||
    a.sealNumber?.toLowerCase().includes(search.toLowerCase()) ||
    a.assignedToUserName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.sealId) { toast.error("Please select a seal"); return; }
    setSaving(true);
    try {
      await assignmentsApi.create(form);
      toast.success("Seal assigned successfully");
      setShowCreate(false);
      setForm({ sealId: "", assignedToUserId: "", assignedToOfficeId: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to create assignment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Assignments</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} assignment{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Assign Seal
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by seal number or user..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                    <th className="text-left">Assigned To</th>
                    <th className="text-left">Office</th>
                    <th className="text-left">Assigned By</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground"><ClipboardList className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No assignments found</p></td></tr>
                  ) : (
                    filtered.map((a) => (
                      <tr key={a.assignmentId}>
                        <td><SealNumberBadge number={a.sealNumber} /></td>
                        <td className="text-sm font-medium">{a.assignedToUserName ?? "—"}</td>
                        <td className="text-sm text-muted-foreground">{a.assignedToOfficeName ?? "—"}</td>
                        <td className="text-sm text-muted-foreground">{a.assignedByUserName}</td>
                        <td className="text-xs text-muted-foreground">{formatDateTime(a.assignmentDate)}</td>
                        <td>
                          {a.status === "ACTIVE" ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <Clock className="w-3.5 h-3.5" /> Returned
                            </span>
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
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Assign Seal</DialogTitle>
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
                    <SelectItem value="none" disabled>No seals in stock</SelectItem>
                  ) : (
                    seals.map((s: any) => (
                      <SelectItem key={s.sealId} value={s.sealId}>{s.sealNumber}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign to User</Label>
              <Select value={form.assignedToUserId} onValueChange={(v) => setForm({ ...form, assignedToUserId: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <SelectItem value="none" disabled>No users available</SelectItem>
                  ) : (
                    users.map((u: any) => (
                      <SelectItem key={u.userId} value={u.userId}>{u.fullName}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign to Office</Label>
              <Select value={form.assignedToOfficeId} onValueChange={(v) => setForm({ ...form, assignedToOfficeId: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select office..." />
                </SelectTrigger>
                <SelectContent>
                  {offices.length === 0 ? (
                    <SelectItem value="none" disabled>No offices available</SelectItem>
                  ) : (
                    offices.map((o: any) => (
                      <SelectItem key={o.officeId} value={o.officeId}>{o.officeName}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Assigning..." : "Assign Seal"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
