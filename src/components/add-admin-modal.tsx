"use client";

import React, { useState } from "react";
import { useAppState } from "@/context/app-state";
import { X, Info, Send } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAdminModal({ isOpen, onClose }: AddAdminModalProps) {
  const { addAdministrator } = useAppState();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Super Admin" | "Registry">("Registry");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await addAdministrator(fullName, email, role);
      setSuccessMsg("Administrator invitation created successfully!");
      setFullName("");
      setEmail("");
      setRole("Registry");
      setMessage("");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to add administrator. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      {/* Modal Container */}
      <div className="bg-surface-container-lowest w-full max-w-[600px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-outline-variant">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-outline-variant flex items-start justify-between bg-surface-container-lowest">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary">Add New Admin</h2>
            <p className="text-xs text-on-surface-variant mt-1">Invite a new member to the administrative team.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 py-6 overflow-y-auto flex-1 space-y-6">
            {errorMsg && (
              <div className="p-3 bg-error/15 border border-error/20 text-error rounded-lg text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-success/15 border border-success/20 text-success rounded-lg text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

            {/* Input Group: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-on-surface">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Abdullah Musa" 
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-bold text-on-surface">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abdullah@example.com" 
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex flex-col gap-3">
              <label className="text-xs font-bold text-on-surface">Assign Role</label>
              <div className="grid grid-cols-1 gap-3">
                {/* Role: Super Admin */}
                <label className={`relative flex items-start p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors ${
                  role === "Super Admin" ? "border-primary bg-primary/5" : "border-outline-variant"
                }`}>
                  <input 
                    type="radio" 
                    name="adminRole" 
                    value="Super Admin" 
                    checked={role === "Super Admin"}
                    onChange={() => setRole("Super Admin")}
                    className="mt-1 text-primary focus:ring-primary border-outline-variant" 
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-on-surface">Super Admin</span>
                    <span className="block text-xs text-on-surface-variant mt-0.5">Full access to all modules, settings, administrative reports, and access controls.</span>
                  </div>
                </label>
                
                {/* Role: Registry */}
                <label className={`relative flex items-start p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors ${
                  role === "Registry" ? "border-primary bg-primary/5" : "border-outline-variant"
                }`}>
                  <input 
                    type="radio" 
                    name="adminRole" 
                    value="Registry" 
                    checked={role === "Registry"}
                    onChange={() => setRole("Registry")}
                    className="mt-1 text-primary focus:ring-primary border-outline-variant" 
                  />
                  <div className="ml-4">
                    <span className="block text-sm font-bold text-on-surface">Registry Admin</span>
                    <span className="block text-xs text-on-surface-variant mt-0.5">Can manage delegates, verify payments, and handle group/room allocation tasks. Cannot view or edit access controls.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Personal Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold text-on-surface">Personal Message <span className="text-on-surface-variant font-normal">(Optional)</span></label>
              <textarea 
                id="message" 
                rows={3} 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a personal note to the invitation email..." 
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant rounded-lg text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Security Note */}
            <div className="bg-surface-container-high rounded-xl p-4 flex gap-3 border border-outline-variant/30 items-start">
              <Info className="text-primary w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                An automated invitation link will be sent to the provided email address. For security, the link will expire in 48 hours.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-5 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-end gap-3 bg-surface-container-lowest">
            <button 
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto h-12 px-6 text-primary font-bold hover:bg-primary-container/10 transition-colors rounded-xl text-xs"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto h-12 px-8 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary/95 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
