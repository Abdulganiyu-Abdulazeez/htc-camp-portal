"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState } from "@/context/app-state";
import { ArrowLeft, ShieldAlert, KeyRound, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAsAdmin } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg("Please enter the administrator email address.");
      return;
    }
    if (!password) {
      setErrorMsg("Please enter the administrator password.");
      return;
    }
    const success = loginAsAdmin(email, password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Incorrect admin security credentials. Please try again.");
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-on-surface-variant">Administrator Email</label>
              <span className="text-[10px] text-on-surface-variant font-mono">Default: admin@ikeja-area.org</span>
            </div>
            <input
              type="email"
              placeholder="admin@ikeja-area.org"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMsg("");
              }}
              className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                errorMsg ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
              } focus:outline-none focus:ring-4 transition-all text-sm`}
            />
          </div>

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

          {errorMsg && (
            <p className="text-xs text-error font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2 shadow-md"
          >
            Authorize Secure Session
            <KeyRound className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
