"use client";

import React from "react";
import { useAppState } from "@/context/app-state";
import { Paperclip, Image as ImageIcon, FileText, Download } from "lucide-react";
import { MarkdownRenderer } from "@/components/markdown-renderer";

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

            // Separate images and documents
            const images = ann.attachments?.filter((att) => att.type === "image") || [];
            const docs = ann.attachments?.filter((att) => att.type === "document") || [];

            return (
              <div 
                key={ann.id} 
                className={`p-5 bg-surface-container-low border-l-4 ${borderClass} rounded-r-xl border-y border-r border-outline-variant flex flex-col gap-3 shadow-sm`}
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
                
                <div className="text-xs text-on-surface-variant leading-relaxed">
                  <MarkdownRenderer text={ann.content} />
                </div>

                {/* Stored Image Attachments Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                    {images.map((img, imgIdx) => (
                      <div key={imgIdx} className="group relative rounded-xl overflow-hidden border border-outline-variant bg-surface-container shadow-sm max-w-[240px]">
                        <img 
                          src={img.url} 
                          alt={img.name} 
                          className="w-full h-32 object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={img.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white/90 text-on-surface rounded-full hover:bg-white transition-colors text-xs font-bold px-3"
                          >
                            View Full
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Stored Document Attachments List */}
                {docs.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    <span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1">
                      <Paperclip className="w-3.5 h-3.5" />
                      Documents ({docs.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {docs.map((doc, docIdx) => (
                        <div 
                          key={docIdx} 
                          className="flex items-center gap-3 pl-3 pr-2 py-2 bg-surface-container border border-outline-variant/60 rounded-xl text-xs shadow-sm hover:border-primary transition-colors"
                        >
                          <FileText className="w-4 h-4 text-accent shrink-0" />
                          <span className="max-w-[150px] truncate font-semibold text-on-surface">{doc.name}</span>
                          <a
                            href={doc.url}
                            download={doc.name}
                            className="p-1 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Download Document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
