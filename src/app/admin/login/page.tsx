"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/context/app-state";
import { ArrowLeft, ShieldAlert, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAsAdmin } = useAppState();
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loginMode, setLoginMode] = useState<"password" | "magic">("password");
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMode === "password") {
      if (!password) {
        setErrorMsg("Please enter the administrator password.");
        return;
      }
      const success = loginAsAdmin(password);
      if (success) {
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Incorrect admin security credentials. Please try again.");
      }
    } else {
      if (!magicEmail) {
        setErrorMsg("Please enter your admin email address.");
        return;
      }
      if (!/\S+@\S+\.\S+/.test(magicEmail)) {
        setErrorMsg("Please enter a valid email address.");
        return;
      }
      setMagicSent(true);
      setTimeout(() => {
        // Automatically bypass magic link for simulation
        loginAsAdmin("admin123");
        router.push("/admin/dashboard");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 py-12">
      {/* Home link */}
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Landing Page
      </Link>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-md w-full p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="text-primary w-12 h-12" />
          <h2 className="text-xl md:text-2xl font-extrabold text-primary">Admin Security Gateway</h2>
          <p className="text-xs text-on-surface-variant max-w-[280px]">
            Access to the HTC Operations Hub requires secure credential verification.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant">
          <button
            type="button"
            onClick={() => {
              setLoginMode("password");
              setErrorMsg("");
              setMagicSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
              loginMode === "password"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Password Authorization
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode("magic");
              setErrorMsg("");
              setMagicSent(false);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
              loginMode === "magic"
                ? "bg-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Magic Link Access
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {loginMode === "password" ? (
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-on-surface-variant">Security Password</label>
                <span className="text-[10px] text-on-surface-variant font-mono">Default: htc2026</span>
              </div>
              <input
                type="password"
                placeholder="Enter password credential"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                }}
                className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                  errorMsg ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                } focus:outline-none focus:ring-4 transition-all text-sm font-mono`}
              />
            </div>
          ) : magicSent ? (
            <div className="py-6 flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-primary">Sending magic link to {magicEmail}...</p>
              <p className="text-[11px] text-on-surface-variant">Simulation: Redirecting to dashboard in a moment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Administrator Email</label>
              <input
                type="email"
                placeholder="admin@ikeja-area.org"
                value={magicEmail}
                onChange={(e) => {
                  setMagicEmail(e.target.value);
                  setErrorMsg("");
                }}
                className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                  errorMsg ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                } focus:outline-none focus:ring-4 transition-all text-sm`}
              />
            </div>
          )}

          {errorMsg && !magicSent && (
            <p className="text-xs text-error font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}

          {!magicSent && (
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2 shadow-md"
            >
              Authorize Secure Session
              <KeyRound className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
