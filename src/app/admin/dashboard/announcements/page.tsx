"use client";

import React, { useState } from "react";
import { useAppState, Announcement } from "@/context/app-state";
import { Megaphone, Send, Save, Trash2, FileText, CheckCircle, Clock } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "Logistics", label: "Logistics" },
  { value: "Curriculum", label: "Curriculum" },
  { value: "Emergency", label: "Emergency" },
  { value: "Spiritual", label: "Spiritual" },
];

export default function AdminAnnouncementsPage() {
  const { announcements, publishAnnouncement, saveAnnouncementDraft, deleteAnnouncement } = useAppState();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Announcement["category"]>("Logistics");
  const [content, setContent] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    await publishAnnouncement(title, category, content, expiryDate || undefined);
    setStatusMsg("Successfully published announcement!");
    setTitle("");
    setContent("");
    setExpiryDate("");
    setCategory("Logistics");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const handleSaveDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill out all fields.");
      return;
    }

    await saveAnnouncementDraft(title, category, content, expiryDate || undefined);
    setStatusMsg("Saved announcement as draft!");
    setTitle("");
    setContent("");
    setExpiryDate("");
    setCategory("Logistics");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider">Communication Hub</span>
          <h2 className="text-xl md:text-2xl font-bold mt-1">Announcements Center</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Broadcast critical updates, camp logistics, and curriculum changes to all registered delegates instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Composer Area (Left 8 Columns) */}
        <section className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-base text-primary mb-6 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Compose New Announcement
            </h3>

            {statusMsg && (
              <div className="p-3 bg-success/15 border border-success/20 text-success rounded-lg text-xs font-bold text-center mb-6">
                {statusMsg}
              </div>
            )}

            <form onSubmit={handlePublish} className="space-y-6">
              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Announcement Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Mandatory Pre-Camp Virtual Orientation"
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-on-surface-variant">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Announcement["category"])}
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none appearance-none cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">Message Content</label>
                <div className="border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  <div className="bg-surface-container-high border-b border-outline-variant p-2 flex gap-1 flex-wrap">
                    <button type="button" className="p-1.5 hover:bg-surface-container rounded text-xs font-bold text-on-surface-variant" onClick={() => setContent((c) => c + " **bold** ")}>B</button>
                    <button type="button" className="p-1.5 hover:bg-surface-container rounded text-xs italic text-on-surface-variant" onClick={() => setContent((c) => c + " *italic* ")}>I</button>
                    <button type="button" className="p-1.5 hover:bg-surface-container rounded text-xs text-on-surface-variant" onClick={() => setContent((c) => c + " - bullet ")}>- List</button>
                  </div>
                  <textarea
                    rows={8}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Type your announcement here (supports markdown)..."
                    className="w-full p-4 focus:outline-none resize-none bg-surface-container-low text-xs border-none"
                    required
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-on-surface-variant">Expiration Date</label>
                  <input
                    type="datetime-local"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-6 py-3 border border-outline text-on-surface text-xs font-bold rounded-lg hover:bg-surface-container transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Save as Draft
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  Publish & Notify
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* History / Status Area (Right 4 Columns) */}
        <section className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-primary mb-4">Past Broadcasts</h3>
            
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-6 font-medium">No announcements published yet.</p>
              ) : (
                announcements.map((ann) => (
                  <div key={ann.id} className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 relative group flex flex-col gap-2 shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                        ann.status === "Published"
                          ? "bg-success/15 text-success border border-success/20"
                          : "bg-surface-container-highest text-on-surface-variant border border-outline-variant"
                      }`}>
                        {ann.status}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this announcement?")) {
                            deleteAnnouncement(ann.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-outline hover:text-error rounded"
                        title="Delete Broadcast"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold truncate pr-6">{ann.title}</h4>
                      <p className="text-[10px] text-primary font-bold tracking-wider mt-0.5">{ann.category}</p>
                    </div>

                    <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3">
                      {ann.content}
                    </p>

                    <div className="flex items-center gap-1.5 text-[9px] text-outline font-semibold border-t border-outline-variant/30 pt-2 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                      {ann.expiryDate && (
                        <>
                          <span className="text-outline/50">•</span>
                          <span>Expires: {new Date(ann.expiryDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
