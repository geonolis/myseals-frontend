/**
 * mySeals — Offices Page
 */

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
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
import { officesApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Building2, RefreshCw, Search, MapPin, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

const MOCK_OFFICES = [
  { officeId: "1", officeName: "Headquarters", officeCode: "HQ-001", address: "Rua da Alfândega 1, Lisbon", contactEmail: "hq@customs.pt", contactPhone: "+351 210 000 001", parentOfficeName: null, createdAt: new Date(Date.now() - 31536000000).toISOString() },
  { officeId: "2", officeName: "Lisbon Port Office", officeCode: "LIS-001", address: "Porto de Lisboa, Lisbon", contactEmail: "lisbon@customs.pt", contactPhone: "+351 210 000 002", parentOfficeName: "Headquarters", createdAt: new Date(Date.now() - 15768000000).toISOString() },
  { officeId: "3", officeName: "Porto Office", officeCode: "PRT-001", address: "Porto de Leixões, Matosinhos", contactEmail: "porto@customs.pt", contactPhone: "+351 220 000 001", parentOfficeName: "Headquarters", createdAt: new Date(Date.now() - 10512000000).toISOString() },
  { officeId: "4", officeName: "Faro Office", officeCode: "FAR-001", address: "Aeroporto de Faro, Faro", contactEmail: "faro@customs.pt", contactPhone: "+351 289 000 001", parentOfficeName: "Headquarters", createdAt: new Date(Date.now() - 7776000000).toISOString() },
];

export default function Offices() {
  const [offices, setOffices] = useState<any[]>(MOCK_OFFICES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ officeName: "", officeCode: "", address: "", contactEmail: "", contactPhone: "", parentOfficeId: "" });

  const load = () => {
    setLoading(true);
    officesApi.getAll().then((r) => { if (r.data?.length) setOffices(r.data); }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = offices.filter((o) =>
    !search ||
    o.officeName?.toLowerCase().includes(search.toLowerCase()) ||
    o.officeCode?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.officeName || !form.officeCode) { toast.error("Office name and code are required"); return; }
    setSaving(true);
    try {
      await officesApi.create(form);
      toast.success(`Office ${form.officeName} created`);
      setShowCreate(false);
      setForm({ officeName: "", officeCode: "", address: "", contactEmail: "", contactPhone: "", parentOfficeId: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to create office");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Offices</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} office{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add Office
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name or code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No offices found</p>
            </div>
          ) : (
            filtered.map((o) => (
              <Card key={o.officeId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground bg-muted px-2 py-1 rounded">
                      {o.officeCode}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>{o.officeName}</h3>
                  {o.parentOfficeName && (
                    <p className="text-xs text-muted-foreground mb-3">Under: {o.parentOfficeName}</p>
                  )}
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-border">
                    {o.address && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{o.address}</span>
                      </div>
                    )}
                    {o.contactEmail && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{o.contactEmail}</span>
                      </div>
                    )}
                    {o.contactPhone && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{o.contactPhone}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">Since {formatDate(o.createdAt)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Add New Office</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Office Name *</Label>
                <Input placeholder="Lisbon Airport" value={form.officeName} onChange={(e) => setForm({ ...form, officeName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Office Code *</Label>
                <Input placeholder="LIS-002" value={form.officeCode} onChange={(e) => setForm({ ...form, officeCode: e.target.value })} className="mt-1 font-mono" />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input placeholder="Street, City" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Email</Label>
                <Input type="email" placeholder="office@customs.pt" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Contact Phone</Label>
                <Input placeholder="+351 ..." value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Parent Office</Label>
              <Select value={form.parentOfficeId} onValueChange={(v) => setForm({ ...form, parentOfficeId: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select parent office..." /></SelectTrigger>
                <SelectContent>
                  {offices.map((o: any) => <SelectItem key={o.officeId} value={o.officeId}>{o.officeName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Add Office"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
