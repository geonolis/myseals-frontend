/**
 * mySeals — Users Page
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
import { usersApi, officesApi, rolesApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Plus, Users as UsersIcon, RefreshCw, Search, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

const MOCK_USERS = [
  { userId: "1", fullName: "Admin User", email: "admin@customs.pt", roleName: "HQ_ADMIN", officeName: "Headquarters", isActive: true, createdAt: new Date(Date.now() - 7776000000).toISOString() },
  { userId: "2", fullName: "Carlos Silva", email: "c.silva@customs.pt", roleName: "EMPLOYEE", officeName: "Lisbon Port Office", isActive: true, createdAt: new Date(Date.now() - 5184000000).toISOString() },
  { userId: "3", fullName: "Ana Ferreira", email: "a.ferreira@customs.pt", roleName: "EMPLOYEE", officeName: "Lisbon Port Office", isActive: true, createdAt: new Date(Date.now() - 4320000000).toISOString() },
  { userId: "4", fullName: "João Mendes", email: "j.mendes@customs.pt", roleName: "OFFICE_MANAGER", officeName: "Porto Office", isActive: true, createdAt: new Date(Date.now() - 2592000000).toISOString() },
  { userId: "5", fullName: "Maria Santos", email: "m.santos@customs.pt", roleName: "EMPLOYEE", officeName: "Faro Office", isActive: false, createdAt: new Date(Date.now() - 1296000000).toISOString() },
];

const ROLE_COLORS: Record<string, string> = {
  HQ_ADMIN: "bg-violet-100 text-violet-700",
  OFFICE_MANAGER: "bg-blue-100 text-blue-700",
  EMPLOYEE: "bg-slate-100 text-slate-700",
};

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [offices, setOffices] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({ fullName: "", email: "", auth0UserId: "", officeId: "", roleId: "", phoneNumber: "" });

  const load = () => {
    setLoading(true);
    usersApi.getAll().then((r) => { setUsers(r.data ?? []); }).catch((err) => { toast.error(err.message ?? "Failed to load users"); }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    officesApi.getAll().then((r) => { setOffices(r.data ?? []); }).catch(() => {});
    rolesApi.getAll().then((r) => { setRoles(r.data ?? []); }).catch(() => {});
  }, []);

  const filtered = users.filter((u) =>
    !search ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.officeName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!form.fullName || !form.email) { toast.error("Name and email are required"); return; }
    setSaving(true);
    try {
      await usersApi.create(form);
      toast.success(`User ${form.fullName} created`);
      setShowCreate(false);
      setForm({ fullName: "", email: "", auth0UserId: "", officeId: "", roleId: "", phoneNumber: "" });
      load();
    } catch (e: any) {
      toast.error(e.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Sora', sans-serif" }}>Users</h2>
            <p className="text-muted-foreground text-sm mt-0.5">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button size="sm" onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add User
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email or office..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th className="text-left">User</th>
                    <th className="text-left">Role</th>
                    <th className="text-left">Office</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-muted-foreground"><UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-30" /><p className="text-sm">No users found</p></td></tr>
                  ) : (
                    filtered.map((u) => (
                      <tr key={u.userId}>
                        <td>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {u.fullName?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{u.fullName}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${ROLE_COLORS[u.roleName] ?? "bg-gray-100 text-gray-700"}`}>
                            {u.roleName}
                          </span>
                        </td>
                        <td className="text-sm text-muted-foreground">{u.officeName}</td>
                        <td>
                          {u.isActive ? (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                              <XCircle className="w-3.5 h-3.5" /> Inactive
                            </span>
                          )}
                        </td>
                        <td className="text-xs text-muted-foreground">{formatDate(u.createdAt)}</td>
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
            <DialogTitle style={{ fontFamily: "'Sora', sans-serif" }}>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="João Silva" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" placeholder="j.silva@customs.pt" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Auth0 User ID</Label>
              <Input placeholder="auth0|..." value={form.auth0UserId} onChange={(e) => setForm({ ...form, auth0UserId: e.target.value })} className="mt-1 font-mono text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Office</Label>
                <Select value={form.officeId} onValueChange={(v) => setForm({ ...form, officeId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {offices.length === 0 ? <SelectItem value="none" disabled>No offices</SelectItem> : offices.map((o: any) => <SelectItem key={o.officeId} value={o.officeId}>{o.officeName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.roleId} onValueChange={(v) => setForm({ ...form, roleId: v })}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    {roles.length === 0 ? <SelectItem value="none" disabled>No roles</SelectItem> : roles.map((r: any) => <SelectItem key={r.roleId} value={r.roleId}>{r.roleName}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input placeholder="+351 900 000 000" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving}>{saving ? "Saving..." : "Add User"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
