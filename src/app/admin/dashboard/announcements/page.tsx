"use client";

import React, { useState, useRef } from "react";
import { useAppState, Announcement } from "@/context/app-state";
import {
  Megaphone,
  Send,
  Save,
  Trash2,
  FileText,
  Clock,
  UploadCloud,
  X,
  Image as ImageIcon,
  Paperclip,
  Download,
} from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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
  const [attachments, setAttachments] = useState<Required<Announcement>["attachments"]>([]);
  const [statusMsg, setStatusMsg] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const type = file.type.startsWith("image/") ? "image" : "document";
        setAttachments((prev) => [...prev, { name: file.name, url, type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    await publishAnnouncement(title, category, content, expiryDate || undefined, attachments);
    setStatusMsg("Successfully published announcement!");
    setTitle("");
    setContent("");
    setExpiryDate("");
    setCategory("Logistics");
    setAttachments([]);
    setActiveTab("write");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  const handleSaveDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please fill out all required fields.");
      return;
    }

    await saveAnnouncementDraft(title, category, content, expiryDate || undefined, attachments);
    setStatusMsg("Saved announcement as draft!");
    setTitle("");
    setContent("");
    setExpiryDate("");
    setCategory("Logistics");
    setAttachments([]);
    setActiveTab("write");
    setTimeout(() => setStatusMsg(""), 2000);
  };

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-outline-variant">
        <div>
          <span className="text-primary font-bold text-xs uppercase tracking-wider">Communication Hub</span>
          <h2 className="text-xl md:text-2xl font-bold mt-1">Announcements Center</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Broadcast critical updates, packing guides, and resource materials with working image/document attachments.
          </p>
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
                    placeholder="e.g. Camp Prospectus & Essential Guides"
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
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-on-surface-variant">Message Content</label>
                  <div className="flex bg-surface-container border border-outline-variant rounded-lg p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "write"
                          ? "bg-primary text-white shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("preview")}
                      className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                        activeTab === "preview"
                          ? "bg-primary text-white shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <div className="border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-accent/10 transition-all">
                  {activeTab === "write" ? (
                    <>
                      <div className="bg-surface-container-high border-b border-outline-variant p-2 flex gap-1 flex-wrap">
                        <button type="button" className="p-1.5 cursor-pointer bg-surface-container rounded-xl text-[10px] font-bold text-on-surface-variant hover:bg-surface-container-highest transition-colors" onClick={() => setContent((c) => c + " **bold** ")}>B</button>
                        <button type="button" className="p-1.5 cursor-pointer bg-surface-container rounded-xl text-[10px] italic text-on-surface-variant hover:bg-surface-container-highest transition-colors" onClick={() => setContent((c) => c + " _italic_ ")}>I</button>
                        <button type="button" className="p-1.5 cursor-pointer bg-surface-container rounded-xl text-[10px] text-on-surface-variant hover:bg-surface-container-highest transition-colors" onClick={() => setContent((c) => c + " - item ")}>- List</button>
                      </div>
                      <textarea
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Type your announcement details here... (Supports Markdown: **bold**, _italic_, - lists)"
                        className="w-full p-4 focus:outline-none resize-none bg-surface-container-low text-xs border-none"
                        required
                      />
                    </>
                  ) : (
                    <div className="w-full p-4 bg-surface-container-low min-h-[188px] text-xs overflow-y-auto max-h-[300px]">
                      {content.trim() ? (
                        <MarkdownRenderer text={content} className="text-on-surface" />
                      ) : (
                        <p className="text-on-surface-variant/60 italic">Nothing to preview. Start writing in the Write tab!</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Attachment Area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant">Attach Pictures & Documents (Max 2MB per file)</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-primary hover:bg-surface-container/20"
                  }`}
                >
                  <UploadCloud className="w-8 h-8 text-on-surface-variant/80" />
                  <p className="text-xs font-bold text-on-surface">Drag & drop files here, or click to upload</p>
                  <p className="text-[10px] text-on-surface-variant">Supports PDF, DOCX, TXT, PNG, JPG, JPEG, and GIF</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.gif"
                  />
                </div>

                {/* Staged Attachments List */}
                {attachments.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[11px] font-bold text-on-surface-variant">Staged Files ({attachments.length})</span>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-surface-container-high border border-outline-variant rounded-lg text-xs"
                        >
                          {file.type === "image" ? (
                            <ImageIcon className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-accent" />
                          )}
                          <span className="max-w-[120px] truncate font-medium">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeAttachment(idx)}
                            className="p-0.5 text-on-surface-variant hover:text-error hover:bg-surface-container rounded-full transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Expiration Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-bold text-on-surface-variant">Expiration Date (Optional)</label>
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

        {/* History Area (Right 4 Columns) */}
        <section className="xl:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-primary mb-4">Past Broadcasts</h3>

            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
              {announcements.length === 0 ? (
                <p className="text-xs text-on-surface-variant text-center py-6 font-medium">No announcements published yet.</p>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 bg-surface-container rounded-xl border border-outline-variant/60 relative group flex flex-col gap-2 shadow-sm"
                  >
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

                    <div className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3">
                      <MarkdownRenderer text={ann.content} />
                    </div>

                    {/* Display Stored Attachments */}
                    {ann.attachments && ann.attachments.length > 0 && (
                      <div className="flex flex-col gap-1.5 border-t border-outline-variant/30 pt-2 mt-1">
                        <span className="text-[9px] font-bold text-on-surface-variant flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          Attachments ({ann.attachments.length})
                        </span>
                        <div className="flex flex-col gap-1">
                          {ann.attachments.map((file, fileIdx) => (
                            <div key={fileIdx} className="flex items-center justify-between gap-2 p-1.5 bg-surface-container-high rounded border border-outline-variant/50 text-[10px]">
                              <div className="flex items-center gap-1 truncate max-w-[80%]">
                                {file.type === "image" ? (
                                  <ImageIcon className="w-3 h-3 text-primary shrink-0" />
                                ) : (
                                  <FileText className="w-3 h-3 text-accent shrink-0" />
                                )}
                                <span className="truncate font-medium">{file.name}</span>
                              </div>
                              <a
                                href={file.url}
                                download={file.name}
                                className="p-0.5 text-primary hover:bg-surface-container rounded"
                                title="Download attachment"
                              >
                                <Download className="w-3 h-3" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
