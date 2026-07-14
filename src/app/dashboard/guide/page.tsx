"use client";

import React from "react";
import { CheckSquare, HeartPulse } from "lucide-react";
import { useAppState } from "@/context/app-state";

export default function DelegateGuidePage() {
  const { currentDelegate } = useAppState();

  if (!currentDelegate) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-4 border-b border-outline-variant">
        <h2 className="text-xl md:text-2xl font-bold">Camp Preparations</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">Guidelines and checklist to prepare you for the camp experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <h4 className="font-bold text-sm text-primary flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            What to Pack (Camp Checklist)
          </h4>
          <ul className="text-xs text-on-surface-variant flex flex-col gap-2.5 list-disc pl-4 leading-relaxed">
            <li>Copy of your Digital Ticket Badge (Printout or phone screenshot).</li>
            <li>Quran, study notebook, and writing utensils.</li>
            <li>Bedding (pillow, bedsheets, light blanket).</li>
            <li>Appropriate modest clothing (Jalabs/Hijabs/modest wear for females, white/decent outfits for males).</li>
            <li>Toiletries, slippers, and personal medications.</li>
            <li>Flashlight and a mosquito net.</li>
          </ul>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
          <h4 className="font-bold text-sm text-primary flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            Camp Medical Rules
          </h4>
          <ul className="text-xs text-on-surface-variant flex flex-col gap-2.5 list-disc pl-4 leading-relaxed">
            <li>All prescription medications must be declared to the camp clinic upon check-in.</li>
            <li>Strictly no self-medicating is allowed inside the hostel rooms.</li>
            <li>If you have asthma, always carry your inhaler at all times.</li>
            <li>Report any symptoms of illness to your group supervisor immediately.</li>
            <li>Ensure you declare any allergies in the registration form.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
