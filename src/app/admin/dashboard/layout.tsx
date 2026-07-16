"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state";
import { DashboardNav } from "@/components/dashboard-nav";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAdminLoggedIn } = useAppState();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/login");
    }
  }, [isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row">
      <DashboardNav isAdmin={true} />
      
      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
