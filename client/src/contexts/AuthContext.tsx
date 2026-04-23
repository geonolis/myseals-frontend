/**
 * mySeals — Auth Context
 * Wraps Auth0 and exposes auth state + token management throughout the app.
 */

import { useAuth0 } from "@auth0/auth0-react";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import { setAccessToken } from "@/lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    name?: string;
    email?: string;
    picture?: string;
    sub?: string;
  } | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// In preview/demo mode, bypass Auth0 so the UI is fully visible
const PREVIEW_MODE = import.meta.env.VITE_PREVIEW_MODE === "true";

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    isAuthenticated: auth0IsAuthenticated,
    isLoading: auth0IsLoading,
    user: auth0User,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  const isAuthenticated = PREVIEW_MODE ? true : auth0IsAuthenticated;
  const isLoading = PREVIEW_MODE ? false : auth0IsLoading;
  const user = PREVIEW_MODE
    ? { name: "Demo User", email: "demo@customs.pt", picture: undefined, sub: "demo" }
    : auth0User ?? null;

  // Fetch and cache the access token whenever auth state changes
  useEffect(() => {
    if (!PREVIEW_MODE && auth0IsAuthenticated) {
      getAccessTokenSilently()
        .then((token) => setAccessToken(token))
        .catch(() => setAccessToken(null));
    } else if (!PREVIEW_MODE) {
      setAccessToken(null);
    }
  }, [auth0IsAuthenticated, getAccessTokenSilently]);

  const login = () => loginWithRedirect();
  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
