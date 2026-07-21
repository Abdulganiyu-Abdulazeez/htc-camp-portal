"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "@/context/app-state";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";

type VerifyState = "verifying" | "success" | "failed" | "error";

function PaymentCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPayment, loginAsDelegate } = useAppState();

  const [state, setState] = useState<VerifyState>("verifying");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const ref = searchParams.get("reference") || searchParams.get("trxref");

    if (!ref) {
      setState("error");
      setMessage("No payment reference found. Please contact support.");
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    setReference(ref);

    (async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${encodeURIComponent(ref)}`);
        const data = await res.json();

        if (data.status && data.data?.paymentStatus === "success") {
          // Mark payment confirmed in our state and database
          await confirmPayment(ref);
          await loginAsDelegate(ref);
          setState("success");
          setMessage(`Payment of ₦${Number(data.data.amount).toLocaleString()} confirmed via ${data.data.channel || "card"}.`);

          // Auto-redirect after 3 seconds
          setTimeout(() => {
            router.push("/dashboard");
          }, 3000);
        } else if (data.data?.paymentStatus === "abandoned") {
          setState("failed");
          setMessage("You cancelled the payment. You can retry from your registration details.");
        } else {
          setState("failed");
          setMessage(data.message || "Payment was not successful. Please try again or pay manually.");
        }
      } catch {
        setState("error");
        setMessage("Unable to verify payment. Please check your internet connection and try again, or contact support with your reference code.");
      }
    })();
  }, [searchParams, confirmPayment, loginAsDelegate, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Brand */}
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <img
          src="/mss-ikeja-logo.png"
          alt="MSSN Ikeja Logo"
          className="w-14 h-14 object-contain"
        />
        <h1 className="text-xl font-extrabold text-primary tracking-tight">MSSN Ikeja HTC Portal</h1>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center gap-6 text-center">
        {/* Icon */}
        {state === "verifying" && (
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        )}
        {state === "success" && (
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
        )}
        {state === "failed" && (
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        )}
        {state === "error" && (
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center animate-in zoom-in-50 duration-300">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
        )}

        {/* Heading */}
        <div className="flex flex-col gap-1">
          {state === "verifying" && (
            <>
              <h2 className="text-xl font-extrabold text-on-surface">Verifying Payment…</h2>
              <p className="text-sm text-on-surface-variant">Please wait while we confirm your payment with Paystack.</p>
            </>
          )}
          {state === "success" && (
            <>
              <h2 className="text-xl font-extrabold text-emerald-600">Payment Confirmed!</h2>
              <p className="text-sm text-on-surface-variant">
                {message}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">Redirecting you to your dashboard in a moment…</p>
            </>
          )}
          {state === "failed" && (
            <>
              <h2 className="text-xl font-extrabold text-red-600">Payment Failed</h2>
              <p className="text-sm text-on-surface-variant">{message}</p>
            </>
          )}
          {state === "error" && (
            <>
              <h2 className="text-xl font-extrabold text-amber-600">Verification Error</h2>
              <p className="text-sm text-on-surface-variant">{message}</p>
            </>
          )}
        </div>

        {/* Reference code (always show if available) */}
        {reference && state !== "verifying" && (
          <div className="w-full p-3 bg-surface-container border border-outline-variant rounded-xl text-xs text-left">
            <span className="text-on-surface-variant font-semibold">Reference Code: </span>
            <span className="font-mono font-bold text-primary select-all">{reference}</span>
          </div>
        )}

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          {state === "success" && (
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm transition-all shadow cursor-pointer"
            >
              Go to Dashboard
            </button>
          )}
          {(state === "failed" || state === "error") && (
            <>
              <button
                onClick={() => router.push("/register")}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-white font-bold rounded-xl text-sm transition-all shadow cursor-pointer"
              >
                Return to Registration
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full py-3 border border-outline text-on-surface hover:bg-surface-container font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Go to Home
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
          <div className="flex flex-col items-center gap-2 mb-8 text-center">
            <img
              src="/mss-ikeja-logo.png"
              alt="MSSN Ikeja Logo"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-xl font-extrabold text-primary tracking-tight">MSSN Ikeja HTC Portal</h1>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-md w-full p-8 flex flex-col items-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-extrabold text-on-surface">Loading…</h2>
              <p className="text-sm text-on-surface-variant">Preparing payment verification details...</p>
            </div>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
