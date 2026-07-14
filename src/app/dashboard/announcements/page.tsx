"use client";

import React from "react";
import { useAppState } from "@/context/app-state";

export default function DelegateAnnouncementsPage() {
  const { currentDelegate } = useAppState();

  if (!currentDelegate) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-outline-variant">
        <h2 className="text-xl md:text-2xl font-bold">Camp Announcements</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">Stay updated with the latest news and schedules</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-5 bg-surface-container-low border-l-4 border-primary rounded-r-xl border border-outline-variant flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-primary">HTC Registration Deadline Extended</span>
            <span className="text-[10px] text-on-surface-variant">July 11, 2026</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            We have extended registration for the HTC July Session until July 20. Please complete your fee payment as early as possible to secure your hostel allocation.
          </p>
        </div>

        <div className="p-5 bg-surface-container-low border-l-4 border-accent rounded-r-xl border border-outline-variant flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-primary">Pre-camp Briefing Session</span>
            <span className="text-[10px] text-on-surface-variant">July 08, 2026</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            There will be a virtual pre-camp meeting on Zoom for all registered undergraduates and school leavers. The link will be dispatched via email. We will outline the course curriculum and medical guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}
