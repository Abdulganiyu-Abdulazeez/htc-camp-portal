"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state";
import { ShieldCheck, AlertCircle, Eye, EyeOff, KeyRound, Lock, Mail, Users, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { loginAsDelegate, loginAsAdmin, administrators, isAdminLoggedIn, currentDelegate } = useAppState();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Split login states:
  // 'input' -> entering email/ref
  // 'role-choice' -> choice between delegate and admin (if email is recognized as admin)
  // 'admin-password' -> entering password for admin
  const [loginStep, setLoginStep] = useState<"input" | "role-choice" | "admin-password">("input");

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAdminLoggedIn) {
      router.push("/admin/dashboard");
    } else if (currentDelegate) {
      router.push("/dashboard");
    }
  }, [isAdminLoggedIn, currentDelegate, router]);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = identifier.trim().toLowerCase();

    if (!trimmedInput) {
      setErrorMsg("Please enter your email or reference ID.");
      return;
    }

    setErrorMsg("");

    // Check if the input is a recognized admin email
    const isCustomAdmin =
      trimmedInput === "abdulganiyuabdulazeez20@gmail.com" ||
      trimmedInput === "fazaziishola@gmail.com" ||
      trimmedInput === "abdulfataiadam3@gmail.com";
    const isDatabaseAdmin = administrators.some((a) => a.email.toLowerCase() === trimmedInput);

    if (isCustomAdmin || isDatabaseAdmin) {
      // Recognized as admin -> show role choice modal/state
      setLoginStep("role-choice");
    } else {
      // Normal delegate login attempt
      setIsSubmitting(true);
      setTimeout(() => {
        const success = loginAsDelegate(trimmedInput);
        setIsSubmitting(false);
        if (success) {
          router.push("/dashboard");
        } else {
          setErrorMsg("No registration found with this email or reference ID.");
        }
      }, 600);
    }
  };

  const handleChooseDelegate = () => {
    const trimmedInput = identifier.trim().toLowerCase();
    setIsSubmitting(true);
    setErrorMsg("");

    setTimeout(() => {
      const success = loginAsDelegate(trimmedInput);
      setIsSubmitting(false);
      if (success) {
        router.push("/dashboard");
      } else {
        setErrorMsg("No delegate registration profile found for this administrator email.");
        setLoginStep("input");
      }
    }, 600);
  };

  const handleChooseAdmin = () => {
    setLoginStep("admin-password");
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("Please enter your admin password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    setTimeout(() => {
      // Try authentication with provided credentials
      const success = loginAsAdmin(identifier, password);
      setIsSubmitting(false);

      if (success) {
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("Incorrect administrator password.");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3 mb-8 text-center select-none animate-fade-in">
        <img
          src="/mss-ikeja-logo.png"
          alt="MSSN Ikeja Logo"
          className="w-16 h-16 object-contain hover:scale-105 transition-transform duration-200"
        />
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">MSSN Ikeja HTC Portal</h1>
          <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase mt-1">
            Uniform Gateway
          </span>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-2xl w-full max-w-md relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />

        {errorMsg && (
          <div className="p-3 bg-error/15 border border-error/20 text-error rounded-xl text-xs font-bold flex items-center gap-2 mb-5 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-error" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: Enter email or Ref ID */}
        {loginStep === "input" && (
          <div className="animate-fade-in">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-lg font-bold text-on-surface">Login / Check Status</h2>
              <p className="text-xs text-on-surface-variant">
                Enter your registration Email or Payment Reference ID (`REF-XXXXXXXX`) to proceed.
              </p>
            </div>

            <form onSubmit={handleNextStep} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="identifier" className="text-xs font-bold text-on-surface">
                  Email / Reference ID
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
                  <input
                    id="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="e.g. abdullah@example.com or REF-1720"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-on-surface-variant/50 text-on-surface"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-100 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Role Decision (Modal inside Card) */}
        {loginStep === "role-choice" && (
          <div className="animate-fade-in flex flex-col items-center text-center gap-5">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UserCheck className="w-6 h-6" />
            </div>
            
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-bold text-on-surface">Choose Your Portal Role</h2>
              <p className="text-xs text-on-surface-variant max-w-xs">
                Your email is registered as an Administrator. How would you like to access the portal?
              </p>
            </div>

            <div className="flex flex-col gap-3.5 w-full">
              <button
                onClick={handleChooseDelegate}
                disabled={isSubmitting}
                className="w-full py-3 border border-outline hover:bg-surface-container text-on-surface font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <Users className="w-4 h-4 text-primary" />
                Continue as Delegate (Camper)
              </button>
              
              <button
                onClick={handleChooseAdmin}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Continue as Administrator
              </button>
            </div>

            <button
              onClick={() => setLoginStep("input")}
              className="text-xs text-on-surface-variant hover:text-on-surface hover:underline font-bold mt-2 cursor-pointer"
            >
              Go Back
            </button>
          </div>
        )}

        {/* STEP 3: Admin Password Entry */}
        {loginStep === "admin-password" && (
          <div className="animate-fade-in">
            <div className="flex flex-col gap-1 mb-6">
              <h2 className="text-lg font-bold text-primary">Verify Admin Credentials</h2>
              <p className="text-xs text-on-surface-variant">
                Enter your administrative password to log in for <strong className="text-on-surface">{identifier}</strong>.
              </p>
            </div>

            <form onSubmit={handleAdminPasswordSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-xs font-bold text-on-surface">
                  Access Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 w-4 h-4 text-on-surface-variant/60" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-on-surface-variant/50 text-on-surface"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 rounded-full text-on-surface-variant/60 hover:text-on-surface hover:bg-surface-container transition-all"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLoginStep("role-choice")}
                  className="flex-1 py-3 border border-outline text-on-surface-variant font-bold rounded-lg hover:bg-surface-container transition-all text-xs cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify & Log In
                      <KeyRound className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-outline-variant text-center">
          <Link
            href="/"
            className="text-xs font-bold text-primary hover:text-primary/90 transition-colors inline-flex items-center gap-1 hover:underline"
          >
            ← Return to Delegate Gateway
          </Link>
        </div>
      </div>
    </div>
  );
}
