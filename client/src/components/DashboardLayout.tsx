/**
 * mySeals — Dashboard Layout
 * Maritime Authority design: deep navy sidebar, content area with top bar.
 * Fixed left sidebar (256px) with grouped navigation sections.
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Tag,
  Package,
  Users,
  Building2,
  ArrowRightLeft,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// ─── Navigation structure ────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Seal Management",
    items: [
      { href: "/seals", label: "Seals", icon: Tag },
      { href: "/batches", label: "Seal Batches", icon: Package },
      { href: "/assignments", label: "Assignments", icon: ClipboardList },
      { href: "/usage", label: "Seal Usage", icon: FileText },
    ],
  },
  {
    label: "Inventory",
    items: [
      { href: "/stock-movements", label: "Stock Movements", icon: ArrowRightLeft },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/users", label: "Users", icon: Users },
      { href: "/offices", label: "Offices", icon: Building2 },
      { href: "/audit-logs", label: "Audit Logs", icon: Shield },
    ],
  },
];

// ─── Sidebar Component ───────────────────────────────────────────────────────

function Sidebar({ collapsed, onClose }: { collapsed?: boolean; onClose?: () => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        "flex flex-col h-full",
        "bg-[oklch(0.18_0.04_255)]",
        "border-r border-[oklch(0.28_0.05_255)]"
      )}
      style={{ width: collapsed ? 0 : 256, minWidth: collapsed ? 0 : 256 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-[oklch(0.28_0.05_255)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[oklch(0.45_0.18_255)] flex items-center justify-center shadow-md">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm" style={{ fontFamily: "'Sora', sans-serif" }}>
              mySeals
            </div>
            <div className="text-[oklch(0.55_0.06_255)] text-[10px] uppercase tracking-widest">
              Customs Authority
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-[oklch(0.55_0.06_255)] hover:text-white lg:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <div className="text-[oklch(0.45_0.06_255)] text-[10px] font-semibold uppercase tracking-widest px-3 mb-1.5"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location === item.href || location.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={cn("nav-item", isActive && "active")}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                      {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-60" />}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="border-t border-[oklch(0.28_0.05_255)] p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-[oklch(1_0_0/8%)] transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.picture} />
                <AvatarFallback className="bg-[oklch(0.45_0.18_255)] text-white text-xs">
                  {user?.name?.slice(0, 2).toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left min-w-0">
                <div className="text-[oklch(0.88_0.02_255)] text-xs font-medium truncate">
                  {user?.name ?? "User"}
                </div>
                <div className="text-[oklch(0.52_0.04_255)] text-[10px] truncate">
                  {user?.email ?? ""}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => toast.info("Profile settings coming soon")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

// ─── Top Bar ─────────────────────────────────────────────────────────────────

function TopBar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1
        className="text-base font-semibold text-foreground flex-1"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground"
          onClick={() => toast.info("Notifications coming soon")}
        >
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}

// ─── Page title map ──────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/seals": "Seals",
  "/batches": "Seal Batches",
  "/assignments": "Assignments",
  "/usage": "Seal Usage",
  "/stock-movements": "Stock Movements",
  "/users": "Users",
  "/offices": "Offices",
  "/audit-logs": "Audit Logs",
};

// ─── Main Layout ─────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const title =
    Object.entries(PAGE_TITLES).find(([path]) => location.startsWith(path))?.[1] ??
    "mySeals";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 flex-shrink-0" style={{ width: 256 }}>
            <Sidebar onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
