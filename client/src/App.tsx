/**
 * mySeals — App Root
 * Maritime Authority Design System
 * Auth0 authentication + full routing for all pages.
 */

import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Seals from "./pages/Seals";
import SealBatches from "./pages/SealBatches";
import Assignments from "./pages/Assignments";
import SealUsage from "./pages/SealUsage";
import StockMovements from "./pages/StockMovements";
import Users from "./pages/Users";
import Offices from "./pages/Offices";
import AuditLogs from "./pages/AuditLogs";

// Auth0 configuration — replace with your Auth0 tenant details
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || "your-tenant.auth0.com";
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || "your-client-id";
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE || "https://myseals-api";

// ─── Auth Guard ───────────────────────────────────────────────────────────────

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.18_0.04_255)]">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[oklch(0.45_0.18_255)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[oklch(0.65_0.06_255)] text-sm">Loading mySeals...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

// ─── Router ───────────────────────────────────────────────────────────────────

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/seals" component={() => <ProtectedRoute component={Seals} />} />
      <Route path="/batches" component={() => <ProtectedRoute component={SealBatches} />} />
      <Route path="/assignments" component={() => <ProtectedRoute component={Assignments} />} />
      <Route path="/usage" component={() => <ProtectedRoute component={SealUsage} />} />
      <Route path="/stock-movements" component={() => <ProtectedRoute component={StockMovements} />} />
      <Route path="/users" component={() => <ProtectedRoute component={Users} />} />
      <Route path="/offices" component={() => <ProtectedRoute component={Offices} />} />
      <Route path="/audit-logs" component={() => <ProtectedRoute component={AuditLogs} />} />
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function App() {
  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin + "/dashboard",
          audience: AUTH0_AUDIENCE,
          scope: "openid profile email",
        }}
      >
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <AuthProvider>
              <Toaster richColors position="top-right" />
              <Router />
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
}

export default App;
