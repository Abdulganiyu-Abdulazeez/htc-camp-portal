"use client";

import React, { useState } from "react";
import { useAppState, PaystackTransaction } from "@/context/app-state";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function AdminFinancesPage() {
  const { transactions, delegates } = useAppState();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");

  // Calculate statistics
  const successTx = transactions.filter((t) => t.status === "success");
  const failedTx = transactions.filter((t) => t.status === "failed");
  const totalRevenue = successTx.reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = delegates.filter((d) => d.paymentStatus === "pending").length;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = 
      tx.delegateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.delegateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Header toolbar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider">Revenue Tracking</span>
          <h2 className="text-xl md:text-2xl font-bold mt-1">Encampment Finances</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Audit and track real-time Paystack card and transfer payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Live Audit Stream
          </span>
        </div>
      </div>

      {/* Finances Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-success" />
            Total Revenue
          </span>
          <span className="text-3xl font-extrabold text-success">₦{totalRevenue.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Confirmed Paystack settlements</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-success" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Successful Payments
          </span>
          <span className="text-3xl font-extrabold text-on-surface">{successTx.length}</span>
          <span className="text-xs text-on-surface-variant mt-1">Verified delegate transactions</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-emerald-500" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-error" />
            Failed Attempts
          </span>
          <span className="text-3xl font-extrabold text-on-surface">{failedTx.length}</span>
          <span className="text-xs text-on-surface-variant mt-1">Declined or aborted transfers</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-error" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending Verification
          </span>
          <span className="text-3xl font-extrabold text-amber-600">{pendingCount}</span>
          <span className="text-xs text-on-surface-variant mt-1">Registered but unpaid delegates</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
        </div>
      </div>

      {/* Main Ledger Container */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Filters Header */}
        <div className="p-4 border-b border-outline-variant bg-surface-container-high/30 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-accent/20 transition-all max-w-sm w-full">
            <Search className="text-on-surface-variant w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full focus:ring-0 placeholder:text-on-surface-variant/75"
            />
          </div>

          {/* Status Filters */}
          <div className="flex bg-surface-container p-0.5 border border-outline-variant rounded-lg text-[10px] font-bold self-stretch md:self-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-md transition-all cursor-pointer flex-1 md:flex-none text-center ${
                statusFilter === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              All Transfers
            </button>
            <button
              onClick={() => setStatusFilter("success")}
              className={`px-4 py-2 rounded-md transition-all cursor-pointer flex-1 md:flex-none text-center ${
                statusFilter === "success"
                  ? "bg-success text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Successful
            </button>
            <button
              onClick={() => setStatusFilter("failed")}
              className={`px-4 py-2 rounded-md transition-all cursor-pointer flex-1 md:flex-none text-center ${
                statusFilter === "failed"
                  ? "bg-error text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Failed
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant font-bold text-on-surface-variant select-none">
                <th className="p-4 pl-6">Timestamp</th>
                <th className="p-4">Delegate</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-on-surface-variant font-medium">
                    No transactions captured in real-time stream.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-4 pl-6 text-on-surface-variant font-medium">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-on-surface">{tx.delegateName}</span>
                        <span className="text-[10px] text-on-surface-variant">{tx.delegateEmail}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-on-surface-variant">
                      {tx.reference}
                    </td>
                    <td className="p-4 font-medium uppercase text-on-surface-variant">
                      {tx.channel}
                    </td>
                    <td className="p-4 font-extrabold text-sm text-on-surface">
                      ₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      {tx.status === "success" ? (
                        <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-success/15 text-success border border-success/20 inline-flex items-center gap-1 select-none">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                          Successful
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-error/15 text-error border border-error/20 inline-flex items-center gap-1 select-none">
                            <XCircle className="w-3.5 h-3.5 text-error shrink-0" />
                            Failed
                          </span>
                          {tx.errorMessage && (
                            <span className="text-[9px] text-error font-medium flex items-center gap-0.5 leading-none max-w-[150px]">
                              <AlertCircle className="w-2.5 h-2.5 shrink-0" />
                              {tx.errorMessage}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4 pr-6 text-center">
                      <button
                        onClick={() => {
                          const delegate = delegates.find(
                            (d) => d.reference === tx.reference || d.email.toLowerCase() === tx.delegateEmail.toLowerCase()
                          );
                          if (delegate) {
                            router.push(`/admin/dashboard/delegate/${delegate.id}`);
                          } else {
                            alert("This transaction failed during initial stage before a permanent delegate profile was verified.");
                          }
                        }}
                        className="p-1.5 border border-outline hover:border-primary text-on-surface hover:text-primary rounded-lg transition-colors flex items-center justify-center gap-1 mx-auto font-bold cursor-pointer"
                        title="Audit Delegate Details"
                      >
                        <span className="text-[10px]">Verify / Audit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
