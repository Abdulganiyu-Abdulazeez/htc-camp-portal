"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state";
import {
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  BarChart3,
  Database,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

interface DashboardNavProps {
  isAdmin?: boolean;
}

export function DashboardNav({ isAdmin = false }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentDelegate, currentAdmin, logoutDelegate, logoutAdmin } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    if (isAdmin) {
      logoutAdmin();
      router.push("/login");
    } else {
      logoutDelegate();
      router.push("/");
    }
  };

  // Nav links configuration
  const delegateLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/announcements",
      label: "Announcements",
      icon: Megaphone,
    },
    {
      href: "/dashboard/guide",
      label: "Medical & Packing Guide",
      icon: ClipboardList,
    },
  ];

  const adminLinks = [
    {
      href: "/admin/dashboard",
      label: "Executive Overview",
      icon: BarChart3,
      exact: true,
    },
    {
      href: "/admin/dashboard/operations",
      label: "Operations Grid",
      icon: Database,
    },
    {
      href: "/admin/dashboard/announcements",
      label: "Announcement Center",
      icon: Megaphone,
    },
    ...(currentAdmin?.role === "Super Admin"
      ? [
          {
            href: "/admin/dashboard/access",
            label: "Manage Access",
            icon: Users,
          },
        ]
      : []),
    {
      href: "/admin/dashboard/finances",
      label: "Finances",
      icon: Wallet,
    },
    {
      href: "/admin/dashboard/settings",
      label: "Camp Settings",
      icon: Settings,
    },
  ];

  const links = isAdmin ? adminLinks : delegateLinks;

  const isLinkActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && (href !== "/admin/dashboard" || pathname === "/admin/dashboard");
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-6 h-16 bg-surface-container-low border-b border-outline-variant w-full sticky top-0 z-30">
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <ShieldAlert className="text-primary w-6 h-6" />
          ) : (
            <img src="/mss-ikeja-logo.png" alt="MSSN Ikeja Logo" className="w-8 h-8 object-contain" />
          )}
          <span className="font-extrabold text-primary text-base">
            {isAdmin ? "HTC Operations" : "MSSN Ikeja HTC"}
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-on-surface-variant hover:text-on-surface"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="w-[280px] h-full bg-surface-container-low p-6 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 py-4 border-b border-outline-variant">
              {isAdmin ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {currentAdmin ? getInitials(currentAdmin.fullName) : "AD"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm leading-tight truncate">{currentAdmin ? currentAdmin.fullName : "HTC Admin"}</p>
                    <p className="text-[10px] text-primary font-bold tracking-wider mt-0.5 uppercase truncate">{currentAdmin ? currentAdmin.role : "SECURE ACCESS"}</p>
                  </div>
                </>
              ) : (
                currentDelegate && (
                  <>
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                      {getInitials(currentDelegate.fullName)}
                    </div>
                    <div>
                      <p className="font-bold text-sm leading-tight">{currentDelegate.fullName}</p>
                      <p className="text-xs text-on-surface-variant">
                        {currentDelegate.id.startsWith("pending") ? "Pending Verification" : currentDelegate.id}
                      </p>
                    </div>
                  </>
                )
              )}
            </div>

            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isLinkActive(link.href, link.exact);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
                      active
                        ? "bg-primary text-white"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto px-4 py-3 border border-outline text-error font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {isAdmin ? "End Secure Session" : "Logout"}
            </button>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col gap-6 p-6 h-screen w-[280px] shrink-0 bg-surface-container-low border-r border-outline-variant sticky top-0">
        <div className="flex items-center gap-3 mb-6">
          {isAdmin ? (
            <ShieldAlert className="text-primary w-7 h-7" />
          ) : (
            <img src="/mss-ikeja-logo.png" alt="MSSN Ikeja Logo" className="w-8 h-8 object-contain" />
          )}
          <h1 className="text-lg font-extrabold text-primary tracking-tight">
            {isAdmin ? "HTC Operations" : "MSSN Ikeja HTC"}
          </h1>
        </div>

        {isAdmin ? (
          <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
              {currentAdmin ? getInitials(currentAdmin.fullName) : "AD"}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-on-surface truncate leading-tight">{currentAdmin ? currentAdmin.fullName : "HTC Admin"}</p>
              <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold rounded-full mt-1 inline-block truncate">
                {currentAdmin ? currentAdmin.role : "Session Active"}
              </span>
            </div>
          </div>
        ) : (
          currentDelegate && (
            <div className="flex items-center gap-3 p-3 bg-surface-container-high rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                {getInitials(currentDelegate.fullName)}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-on-surface truncate leading-tight">{currentDelegate.fullName}</p>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">
                  {currentDelegate.id.startsWith("pending") ? "Pending Verification" : currentDelegate.id}
                </p>
              </div>
            </div>
          )
        )}

        <nav className="flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isLinkActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-all ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/10 scale-[1.02]"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-3 border border-outline text-error font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {isAdmin ? "End Secure Session" : "Logout"}
        </button>
      </aside>
    </>
  );
}
