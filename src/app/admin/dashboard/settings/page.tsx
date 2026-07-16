"use client";

import React, { useState, useEffect } from "react";
import { useAppState } from "@/context/app-state";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAppState();

  const [settingsForm, setSettingsForm] = useState({
    campFeeSecondary: settings.campFeeSecondary,
    campFeeUndergrad: settings.campFeeUndergrad,
    capacityLimit: settings.capacityLimit,
    startDate: settings.startDate,
    endDate: settings.endDate,
    autoGroupingEnabled: settings.autoGroupingEnabled,
  });

  // Sync settings when loaded from Supabase
  useEffect(() => {
    setSettingsForm({
      campFeeSecondary: settings.campFeeSecondary,
      campFeeUndergrad: settings.campFeeUndergrad,
      capacityLimit: settings.capacityLimit,
      startDate: settings.startDate,
      endDate: settings.endDate,
      autoGroupingEnabled: settings.autoGroupingEnabled,
    });
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert("Camp settings updated successfully!");
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Header toolbar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">System Settings</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">MSSN Ikeja Area Council Encampment Gateway</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full">
            Session Sec-Access Active
          </span>
        </div>
      </div>

      <div className="max-w-2xl bg-surface-container-low border border-outline-variant p-6 rounded-2xl shadow-sm">
        <h3 className="font-bold text-base text-primary mb-4">Camp System Configurations</h3>
        
        <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Secondary School Camp Fee (₦)</label>
                <input
                  type="number"
                  value={settingsForm.campFeeSecondary}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, campFeeSecondary: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                  required
                  min={1000}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Undergraduate & Others Fee (₦)</label>
                <input
                  type="number"
                  value={settingsForm.campFeeUndergrad}
                  onChange={(e) => setSettingsForm((prev) => ({ ...prev, campFeeUndergrad: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                  required
                  min={1000}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Capacity Limit</label>
              <input
                type="number"
                value={settingsForm.capacityLimit}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, capacityLimit: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Camp Start Date</label>
              <input
                type="date"
                value={settingsForm.startDate}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Camp End Date</label>
              <input
                type="date"
                value={settingsForm.endDate}
                onChange={(e) => setSettingsForm((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between border border-outline-variant p-4 rounded-xl">
            <div>
              <p className="text-xs font-bold">Automatic Group Assignment Rule Engine</p>
              <p className="text-[10px] text-on-surface-variant">Trigger group assignment automatically when payments confirm.</p>
            </div>
            <input
              type="checkbox"
              checked={settingsForm.autoGroupingEnabled}
              onChange={(e) => setSettingsForm((prev) => ({ ...prev, autoGroupingEnabled: e.target.checked }))}
              className="rounded border-outline-variant"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2 shadow"
          >
            Save System Settings
            <Save className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
