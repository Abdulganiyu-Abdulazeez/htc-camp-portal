"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state";
import {
  LayoutDashboard,
  Megaphone,
  ClipboardList,
  LogOut,
  AlertCircle,
  CalendarClock,
  Info,
  CheckSquare,
  HeartPulse,
  Menu,
  X
} from "lucide-react";

export default function DelegateDashboard() {
  const router = useRouter();
  const { currentDelegate, logoutDelegate } = useAppState();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // If not logged in, redirect to landing page
    if (!currentDelegate) {
      router.push("/");
    }
  }, [currentDelegate, router]);

  if (!currentDelegate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logoutDelegate();
    router.push("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center px-6 h-16 bg-surface-container-low border-b border-outline-variant w-full">
        <div className="flex items-center gap-2">
          <img src="/mss-ikeja-logo.png" alt="MSSN Ikeja Logo" className="w-8 h-8 object-contain" />
          <span className="font-extrabold text-primary text-base">MSSN Ikeja HTC</span>
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
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="w-[280px] h-full bg-surface-container-low p-6 flex flex-col gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 py-4">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                {getInitials(currentDelegate.fullName)}
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{currentDelegate.fullName}</p>
                <p className="text-xs text-on-surface-variant">{currentDelegate.id.startsWith("pending") ? "Pending Verification" : currentDelegate.id}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
                  activeTab === "dashboard"
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("announcements");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
                  activeTab === "announcements"
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <Megaphone className="w-5 h-5" />
                Announcements
              </button>
              <button
                onClick={() => {
                  setActiveTab("guide");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
                  activeTab === "guide"
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Medical & Packing Guide
              </button>
            </nav>

            <button
              onClick={handleLogout}
              className="mt-auto px-4 py-3 border border-outline text-error font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col gap-6 p-6 h-screen w-[280px] fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant">
        <div className="flex items-center gap-3 mb-6">
          <img src="/mss-ikeja-logo.png" alt="MSSN Ikeja Logo" className="w-8 h-8 object-contain" />
          <h1 className="text-lg font-extrabold text-primary tracking-tight">MSSN Ikeja HTC</h1>
        </div>

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

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === "dashboard"
                ? "bg-primary text-white shadow-md shadow-primary/10 scale-[1.02]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === "announcements"
                ? "bg-primary text-white shadow-md shadow-primary/10 scale-[1.02]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Megaphone className="w-5 h-5" />
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === "guide"
                ? "bg-primary text-white shadow-md shadow-primary/10 scale-[1.02]"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Medical & Packing Guide
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-3 border border-outline text-error font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main Content Fluid Area */}
      <main className="flex-1 md:ml-[280px] p-6 md:p-10 max-w-[1000px] w-full min-h-screen flex flex-col gap-6">
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              {activeTab === "dashboard" && "Delegate Dashboard"}
              {activeTab === "announcements" && "Camp Announcements"}
              {activeTab === "guide" && "Camp Preparations"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Welcome back, {currentDelegate.fullName}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentDelegate.paymentStatus === "verified"
                ? "bg-success/15 text-success border border-success/30"
                : "bg-error/15 text-error border border-error/30"
            }`}>
              {currentDelegate.paymentStatus === "verified" ? "Verified" : "Payment Pending"}
            </span>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left: Badge Container (span 2) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-on-surface-variant">Your Camp Entrance Ticket</h3>
              
              {/* Digital Badge */}
              <div className="ticket-cut bg-gradient-to-br from-primary-container to-primary text-white rounded-3xl p-6 shadow-2xl relative flex flex-col gap-6 select-none max-w-sm w-full mx-auto">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <img src="/mss-ikeja-logo.png" alt="MSSN Ikeja Logo" className="w-5 h-5 object-contain brightness-0 invert" />
                    <span className="text-xs font-extrabold tracking-wider">HTC 2026</span>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest px-2 py-0.5 bg-white/20 text-white rounded">DELEGATE</span>
                </div>

                {/* Main ID */}
                <div className="text-center py-4 flex flex-col gap-1 border-y border-white/10 my-1">
                  <p className="text-[10px] uppercase text-white/70 tracking-widest font-semibold">Registration ID</p>
                  <p className="text-3xl font-extrabold tracking-wider">
                    {currentDelegate.paymentStatus === "verified" ? currentDelegate.id : "PENDING"}
                  </p>
                  <p className="text-[9px] font-mono text-white/50">{currentDelegate.reference}</p>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-semibold">Full Name</p>
                    <p className="font-bold text-base truncate">{currentDelegate.fullName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                    <div>
                      <p className="text-[9px] text-white/70 uppercase tracking-widest">Category</p>
                      <p className="font-semibold">{currentDelegate.category}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-white/70 uppercase tracking-widest">Gender</p>
                      <p className="font-semibold">{currentDelegate.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Barcode simulator */}
                <div className="mt-4 flex flex-col items-center gap-1.5 opacity-85">
                  <div className="w-full h-8 bg-white/20 rounded flex items-center justify-between px-3 gap-0.5 overflow-hidden">
                    {[1, 2, 4, 1, 3, 1, 2, 4, 3, 1, 2, 1, 4, 2, 3, 1, 4, 2, 1, 3].map((w, idx) => (
                      <div key={idx} className="h-full bg-white shrink-0" style={{ width: `${w}px` }} />
                    ))}
                  </div>
                  <p className="text-[9px] tracking-wide text-white/60">Scan at Camp Gate for Verification</p>
                </div>
              </div>
            </div>

            {/* Right: Allocation & Details (span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Allocation Panel */}
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
                <h4 className="font-bold text-base">Room & Group Allocation</h4>
                {currentDelegate.paymentStatus === "pending" ? (
                  <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Payment Verification Pending</p>
                      <p className="text-xs text-error-red mt-1">
                        Please complete your fee payment or wait for administrator manual verification. Allocations are only done for verified registrations.
                      </p>
                    </div>
                  </div>
                ) : currentDelegate.assignedGroup === "None" ? (
                  <div className="p-4 bg-accent/15 border border-accent/30 text-primary rounded-xl flex gap-3 items-start">
                    <CalendarClock className="w-5 h-5 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">Allocation Processing</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Your payment is verified! The administrative team is currently organizing groups. You will receive a notification and your room number here soon.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col gap-1">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Assigned Group</span>
                        <span className="text-lg font-extrabold text-primary">Group {currentDelegate.assignedGroup}</span>
                      </div>
                      <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col gap-1">
                        <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Allocated Room</span>
                        <span className="text-lg font-extrabold text-primary">{currentDelegate.assignedRoom}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl flex gap-3 items-start">
                      <Info className="w-5 h-5 mt-0.5 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold">Camp Attendance Approved</p>
                        <p className="text-on-surface-variant mt-1">
                          You are fully registered for the Holiday Training Course! Please proceed to <strong>{currentDelegate.assignedRoom}</strong> at the venue upon arrival. Report to your supervisor for Group {currentDelegate.assignedGroup} induction.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bio details card */}
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
                <h4 className="font-bold text-base">Your Registration Profile</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant font-medium">Category</span>
                    <span className="font-semibold text-sm">{currentDelegate.category}</span>
                  </div>

                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant font-medium">Skill of Interest</span>
                    <span className="font-semibold text-sm">{currentDelegate.skillOfInterest || "N/A"}</span>
                  </div>

                  {currentDelegate.category === "Secondary School" && (
                    <>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Secondary School</span>
                        <span className="font-semibold text-sm truncate">{currentDelegate.school}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">District</span>
                        <span className="font-semibold text-sm">{currentDelegate.secondaryDistrict || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Class</span>
                        <span className="font-semibold text-sm">{currentDelegate.secondaryClass || "N/A"}</span>
                      </div>
                    </>
                  )}

                  {currentDelegate.category === "Undergraduate/Leaver" && (
                    <>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">University / Institution</span>
                        <span className="font-semibold text-sm truncate">{currentDelegate.school}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Course of Study</span>
                        <span className="font-semibold text-sm">{currentDelegate.courseOfStudy || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Year of Study</span>
                        <span className="font-semibold text-sm">{currentDelegate.yearOfStudy || "N/A"}</span>
                      </div>
                    </>
                  )}

                  {currentDelegate.category === "Others" && (
                    <>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Company Name</span>
                        <span className="font-semibold text-sm truncate">{currentDelegate.school}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Job Title</span>
                        <span className="font-semibold text-sm">{currentDelegate.jobTitle || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                        <span className="text-on-surface-variant font-medium">Employment Mode</span>
                        <span className="font-semibold text-sm">{currentDelegate.employmentMode || "N/A"}</span>
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant font-medium">Phone Number</span>
                    <span className="font-semibold text-sm">{currentDelegate.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant font-medium">Blood Group</span>
                    <span className="font-semibold text-sm">{currentDelegate.bloodGroup || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2">
                    <span className="text-on-surface-variant font-medium">Genotype</span>
                    <span className="font-semibold text-sm">{currentDelegate.genotype || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2 sm:col-span-2">
                    <span className="text-on-surface-variant font-medium">Medical Condition / Allergies</span>
                    <span className="font-semibold text-sm text-error-red">{currentDelegate.medicalCondition}</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b border-outline-variant pb-2 sm:col-span-2">
                    <span className="text-on-surface-variant font-medium">Emergency Contact</span>
                    <span className="font-semibold text-sm">
                      {currentDelegate.emergencyContactName} ({currentDelegate.emergencyContactPhone})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="flex flex-col gap-4">
            <div className="p-5 bg-surface-container-low border-l-4 border-primary rounded-r-xl border border-outline-variant flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary">HTC Registration Deadline Extended</span>
                <span className="text-[10px] text-on-surface-variant">July 11, 2026</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                We have extended registration for the HTC July Session until July 20. Please complete your fee payment as early as possible to secure your hostel allocation.
              </p>
            </div>

            <div className="p-5 bg-surface-container-low border-l-4 border-accent rounded-r-xl border border-outline-variant flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-primary">Pre-camp Briefing Session</span>
                <span className="text-[10px] text-on-surface-variant">July 08, 2026</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                There will be a virtual pre-camp meeting on Zoom for all registered undergraduates and school leavers. The link will be dispatched via email. We will outline the course curriculum and medical guidelines.
              </p>
            </div>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                What to Pack (Camp Checklist)
              </h4>
              <ul className="text-xs text-on-surface-variant flex flex-col gap-2.5 list-disc pl-4">
                <li>Copy of your Digital Ticket Badge (Printout or phone screenshot).</li>
                <li>Quran, study notebook, and writing utensils.</li>
                <li>Bedding (pillow, bedsheets, light blanket).</li>
                <li>Appropriate modest clothing (Jalabs/Hijabs/modest wear for females, white/decent outfits for males).</li>
                <li>Toiletries, slippers, and personal medications.</li>
                <li>Flashlight and a mosquito net.</li>
              </ul>
            </div>

            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
              <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                <HeartPulse className="w-4 h-4" />
                Camp Medical Rules
              </h4>
              <ul className="text-xs text-on-surface-variant flex flex-col gap-2.5 list-disc pl-4">
                <li>All prescription medications must be declared to the camp clinic upon check-in.</li>
                <li>Strictly no self-medicating is allowed inside the hostel rooms.</li>
                <li>If you have asthma, always carry your inhaler at all times.</li>
                <li>Report any symptoms of illness to your group supervisor immediately.</li>
                <li>Ensure you declare any allergies in the registration form.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
