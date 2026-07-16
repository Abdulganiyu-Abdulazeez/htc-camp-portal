"use client";

import React from "react";
import { useAppState, getDelegateFee } from "@/context/app-state";
import { Database, Megaphone, Users, Wallet, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { delegates, settings, autoGroupDelegates } = useAppState();

  // Overall analytics calculation
  const totalVerified = delegates.filter((d) => d.paymentStatus === "verified").length;
  const totalRegistrations = delegates.length;
  const totalPending = totalRegistrations - totalVerified;
  const totalFinancials = delegates
    .filter((d) => d.paymentStatus === "verified")
    .reduce((sum, d) => sum + getDelegateFee(d.category, d.yearOfStudy, settings.campFeeSecondary, settings.campFeeUndergrad), 0);
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
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ungrouped Delegates</span>
          <span className="text-3xl font-extrabold text-indigo-600">{totalUngrouped}</span>
          <span className="text-xs text-on-surface-variant mt-1">Verified delegates with no group</span>
          <div className="absolute top-0 left-0 h-full w-1 bg-indigo-500" />
        </div>
      </div>

      {/* Quick Operations panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Group summaries */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <h3 className="font-bold text-base text-primary">Group Breakdown</h3>
          <p className="text-xs text-on-surface-variant">Allocated group distribution for verified delegates.</p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Abu Bakr (Male)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Abu Bakr").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Umar (Male)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Umar").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Uthman (Male)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Uthman").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Ali (Male)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Ali").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Aisha (Female)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Aisha").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Khadijah (Female)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Khadijah").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Fatimah (Female)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Fatimah").length}
              </p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
              <p className="text-xs text-on-surface-variant font-semibold">Zaynab (Female)</p>
              <p className="text-xl font-extrabold text-primary">
                {delegates.filter((d) => d.assignedGroup === "Zaynab").length}
              </p>
            </div>
          </div>
        </div>

        {/* Other Pages Overview */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <div>
            <h3 className="font-bold text-base text-primary">Portal Modules Overview</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Quick status and navigation for other administrative control panels.</p>
          </div>
          
          <div className="flex flex-col gap-3 mt-2">
            {/* Operations Link */}
            <Link
              href="/admin/dashboard/operations"
              className="flex items-center justify-between p-3.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Operations Grid</h4>
                  <p className="text-[10px] text-on-surface-variant">Verify delegates & view room allocation</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Finances Link */}
            <Link
              href="/admin/dashboard/finances"
              className="flex items-center justify-between p-3.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Finances Dashboard</h4>
                  <p className="text-[10px] text-on-surface-variant">Track Paystack payments & verification status</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Announcements Link */}
            <Link
              href="/admin/dashboard/announcements"
              className="flex items-center justify-between p-3.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Announcements</h4>
                  <p className="text-[10px] text-on-surface-variant">Compose and broadcast camp updates</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Access Control */}
            <Link
              href="/admin/dashboard/access"
              className="flex items-center justify-between p-3.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Access Security</h4>
                  <p className="text-[10px] text-on-surface-variant">Manage admins, passwords, and access roles</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            {/* Settings Link */}
            <Link
              href="/admin/dashboard/settings"
              className="flex items-center justify-between p-3.5 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-500/10 text-slate-600 flex items-center justify-center">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Camp Settings</h4>
                  <p className="text-[10px] text-on-surface-variant">Update base camp fee and event dates</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
