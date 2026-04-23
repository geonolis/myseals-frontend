/**
 * mySeals — Login Page
 * Maritime Authority design: dark navy background with hero image,
 * centered login card with Auth0 integration.
 */

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tag, Shield, ArrowRight, Lock } from "lucide-react";

const LOGIN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/114831836/jUhLj3qQiNsWwtFped3yPY/myseals-login-bg-bNHCfLqr7cr9NSVucea8Tz.webp";

export default function Login() {
  const { login, isLoading } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: `linear-gradient(135deg, oklch(0.12 0.04 255) 0%, oklch(0.18 0.05 255) 100%)`,
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url(${LOGIN_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.04_255/80%)] via-transparent to-[oklch(0.12_0.04_255/60%)]" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[oklch(0.45_0.18_255)] shadow-2xl mb-4">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            mySeals
          </h1>
          <p className="text-[oklch(0.65_0.06_255)] text-sm uppercase tracking-widest">
            Customs Seal Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-[oklch(1_0_0/8%)] backdrop-blur-xl border border-[oklch(1_0_0/15%)] rounded-xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2
              className="text-xl font-semibold text-white mb-2"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Sign in to your account
            </h2>
            <p className="text-[oklch(0.65_0.06_255)] text-sm">
              Access the seal management portal using your organization credentials.
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Shield, text: "Secured with OAuth 2.0 / OpenID Connect" },
              { icon: Lock, text: "Zero-Trust access control" },
              { icon: Tag, text: "Full seal lifecycle tracking" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-[oklch(0.72_0.05_255)]">
                <Icon className="w-4 h-4 text-[oklch(0.55_0.18_255)] flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>

          <Button
            onClick={login}
            disabled={isLoading}
            className="w-full bg-[oklch(0.45_0.18_255)] hover:bg-[oklch(0.50_0.18_255)] text-white font-semibold py-3 h-auto text-sm gap-2"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                Sign in with Auth0
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

          <p className="text-center text-[oklch(0.45_0.06_255)] text-xs mt-4">
            For authorized customs personnel only.
            <br />
            Contact your administrator for access.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[oklch(0.38_0.04_255)] text-xs mt-6">
          mySeals v1.0 · Customs Authority Management System
        </p>
      </div>
    </div>
  );
}
