"use client";

import React from "react";
import { useAppState } from "@/context/app-state";
import { AlertCircle, CalendarClock, Info } from "lucide-react";

export default function DelegateDashboardPage() {
  const { currentDelegate, settings } = useAppState();

  if (!currentDelegate) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Delegate Dashboard</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Welcome back, {currentDelegate.fullName}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            currentDelegate.paymentStatus === "verified"
              ? "bg-success/15 text-success border border-success/30"
              : "bg-error/15 text-error border border-error/30"
          }`}>
            {currentDelegate.paymentStatus === "verified" ? "Paid" : "Pending Verification"}
          </span>
        </div>
      </div>

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
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
            <h4 className="font-bold text-base">Group Allocation</h4>
            {currentDelegate.paymentStatus === "pending" ? (
              <div className="p-4 bg-error/10 border border-error/20 text-error rounded-xl flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <p className="text-xs font-bold">Payment Verification Pending</p>
                  <p className="text-xs text-error-red mt-1">
                    Please complete your fee payment or wait for administrator manual verification. Group assignments are only done for verified registrations.
                  </p>
                </div>
              </div>
            ) : currentDelegate.assignedGroup === "None" ? (
              <div className="p-4 bg-accent/15 border border-accent/30 text-primary rounded-xl flex gap-3 items-start animate-pulse">
                <CalendarClock className="w-5 h-5 mt-0.5 shrink-0 text-primary" />
                <div>
                  <p className="text-xs font-bold">Allocation Processing</p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Your payment is verified! The administrative team is currently organizing groups. You will receive a notification and your group assignment here soon.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant flex flex-col gap-1">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Assigned Group</span>
                    <span className="text-lg font-extrabold text-primary">Group {currentDelegate.assignedGroup}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl flex gap-3 items-start">
                  <Info className="w-5 h-5 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold">Camp Attendance Approved</p>
                    <p className="text-on-surface-variant mt-1">
                      You are fully registered for the Holiday Training Course! Please report to your supervisor for Group {currentDelegate.assignedGroup} induction upon arrival at the venue.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bio details card */}
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
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
    </div>
  );
}
