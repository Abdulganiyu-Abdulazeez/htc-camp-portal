"use client";

import React from "react";
import { useAppState } from "@/context/app-state";

export default function DelegateAnnouncementsPage() {
  const { currentDelegate, announcements } = useAppState();

  if (!currentDelegate) return null;

  // Filter announcements for published ones that are not expired
  const activeAnnouncements = announcements.filter((ann) => {
    if (ann.status !== "Published") return false;
    if (ann.expiryDate) {
      const now = new Date();
      const expiry = new Date(ann.expiryDate);
      if (expiry < now) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-outline-variant">
        <h2 className="text-xl md:text-2xl font-bold">Camp Announcements</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">Stay updated with the latest news and schedules</p>
      </div>

      <div className="flex flex-col gap-4">
        {activeAnnouncements.length === 0 ? (
          <div className="p-8 bg-surface-container-low border border-outline-variant rounded-2xl text-center text-on-surface-variant font-medium">
            No active announcements at the moment. Check back later!
          </div>
        ) : (
          activeAnnouncements.map((ann) => {
            // Determine border color based on category
            let borderClass = "border-primary";
            if (ann.category === "Emergency") borderClass = "border-error";
            else if (ann.category === "Curriculum") borderClass = "border-accent";
            else if (ann.category === "Spiritual") borderClass = "border-success";

            return (
              <div 
                key={ann.id} 
                className={`p-5 bg-surface-container-low border-l-4 ${borderClass} rounded-r-xl border-y border-r border-outline-variant flex flex-col gap-2 shadow-sm`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{ann.title}</span>
                    <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[9px] font-bold">
                      {ann.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">
                    {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                  {ann.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
