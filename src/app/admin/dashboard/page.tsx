"use client";

import React from "react";
import { useAppState, getDelegateFee } from "@/context/app-state";
import { Sparkles } from "lucide-react";

export default function AdminDashboardPage() {
  const { delegates, settings, autoGroupDelegates } = useAppState();

  // Overall analytics calculation
  const totalVerified = delegates.filter((d) => d.paymentStatus === "verified").length;
  const totalRegistrations = delegates.length;
  const totalPending = totalRegistrations - totalVerified;
  const totalFinancials = delegates
    .filter((d) => d.paymentStatus === "verified")
    .reduce((sum, d) => sum + getDelegateFee(d.category, d.yearOfStudy), 0);
  const totalUngrouped = delegates.filter(
    (d) => d.paymentStatus === "verified" && d.assignedGroup === "None"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header toolbar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Executive Overview</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">MSSN Ikeja Area Council Encampment Gateway</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full">
            Session Sec-Access Active
          </span>
        </div>
      </div>

      {/* Numeric metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Registrants</span>
          <span className="text-3xl font-extrabold">{totalRegistrations}</span>
          <div className="text-xs text-on-surface-variant mt-1 flex justify-between">
            <span>Verified: {totalVerified}</span>
            <span>Pending: {totalPending}</span>
          </div>
          <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Verified Financials</span>
          <span className="text-3xl font-extrabold text-success">₦{totalFinancials.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Receipts matching verified payments</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-success" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Verification</span>
          <span className="text-3xl font-extrabold text-amber-600">{totalPending}</span>
          <span className="text-xs text-on-surface-variant mt-1">Requires manual audit override</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ungrouped / Unallocated</span>
          <span className="text-3xl font-extrabold text-indigo-600">{totalUngrouped}</span>
          <span className="text-xs text-on-surface-variant mt-1">Verified delegates with no group</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-indigo-500" />
        </div>
      </div>

      {/* Quick Operations panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Group summaries */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-base text-primary">Group & Room Breakdown</h3>
          <p className="text-xs text-on-surface-variant">Allocated group distribution for verified delegates.</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Abu Bakr (Male Undergrads)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Abu Bakr").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Umar (Male Students)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Umar").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Aisha (Female Undergrads)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Aisha").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Khadijah (Female Students)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Khadijah").length}
              </p>
            </div>
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-base text-primary">Automated Computational Actions</h3>
          <p className="text-xs text-on-surface-variant">Bulk operations tools to manage room assignment triggers.</p>
          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={() => {
                autoGroupDelegates();
                alert("Successfully triggered automatic room assignment rules!");
              }}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Run Auto-Grouping Rule Engine
            </button>
            <p className="text-[10px] text-on-surface-variant text-center">
              Allocates all ungrouped verified delegates to rooms matching their gender and category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
