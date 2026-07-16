"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useAppState, Delegate, getDelegateFee } from "@/context/app-state";
import { CustomSelect } from "@/components/custom-select";
import {
  Search,
  Sparkles,
  Ban,
  Mail,
  X,
  CreditCard,
  ShieldCheck,
  Send,
  Eye,
} from "lucide-react";

const GENDER_FILTER_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Secondary School", label: "Secondary School" },
  { value: "Undergraduate/Leaver", label: "Undergraduate/Leaver" },
  { value: "Others", label: "Others" },
];

const PAYMENT_FILTER_OPTIONS = [
  { value: "All", label: "All" },
  { value: "Verified", label: "Paid" },
  { value: "Pending", label: "Pending" },
];

const GROUP_OPTIONS = [
  { value: "None", label: "None" },
  { value: "Abu Bakr", label: "Abu Bakr" },
  { value: "Umar", label: "Umar" },
  { value: "Uthman", label: "Uthman" },
  { value: "Ali", label: "Ali" },
  { value: "Aisha", label: "Aisha" },
  { value: "Khadijah", label: "Khadijah" },
  { value: "Fatimah", label: "Fatimah" },
  { value: "Zaynab", label: "Zaynab" },
];

export default function AdminOperationsPage() {
  const {
    delegates,
    settings,
    overridePayment,
    assignGroup,
    sendBulkEmail,
  } = useAppState();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer / Modal states
  const [verifyingDelegate, setVerifyingDelegate] = useState<Delegate | null>(null);
  const [paystackLookupRef, setPaystackLookupRef] = useState("");
  const [paystackFound, setPaystackFound] = useState<boolean | null>(null);
  const [isVerifyingRef, setIsVerifyingRef] = useState(false);

  // Email Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailRecipients, setEmailRecipients] = useState<string[]>([]);
  const [emailProgress, setEmailProgress] = useState<number | null>(null);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Filter delegates list
  const filteredDelegates = delegates.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = filterGender === "All" || d.gender === filterGender;
    const matchesCategory = filterCategory === "All" || d.category === filterCategory;
    const matchesStatus = filterStatus === "All" || d.paymentStatus === filterStatus.toLowerCase();

    return matchesSearch && matchesGender && matchesCategory && matchesStatus;
  });

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredDelegates.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // Inline group assignment handler
  const handleInlineGroupChange = (delegateId: string, groupName: string) => {
    assignGroup(delegateId, groupName, "None");
  };

  // Bulk actions
  const handleBulkAutoGroup = () => {
    const groupCounts: Record<string, number> = {};
    const categoryGroupCounts: Record<string, Record<string, number>> = {};
    const allHouses = [
      "Abu Bakr", "Umar", "Uthman", "Ali",
      "Aisha", "Khadijah", "Fatimah", "Zaynab"
    ];
    allHouses.forEach(h => {
      groupCounts[h] = 0;
      categoryGroupCounts[h] = {
        "Secondary School": 0,
        "Undergraduate/Leaver": 0,
        "Others": 0
      };
    });
    delegates.forEach(x => {
      if (x.assignedGroup && x.assignedGroup !== "None" && allHouses.includes(x.assignedGroup)) {
        groupCounts[x.assignedGroup]++;
        const cat = x.category || "Others";
        if (!categoryGroupCounts[x.assignedGroup][cat]) {
          categoryGroupCounts[x.assignedGroup][cat] = 0;
        }
        categoryGroupCounts[x.assignedGroup][cat]++;
      }
    });

    selectedIds.forEach((id) => {
      const d = delegates.find((x) => x.id === id);
      if (d && d.paymentStatus === "verified" && d.assignedGroup === "None") {
        const candidates = d.gender === "Male"
          ? ["Abu Bakr", "Umar", "Uthman", "Ali"]
          : ["Aisha", "Khadijah", "Fatimah", "Zaynab"];

        let bestGroup = candidates[0];
        let minCategoryCount = Infinity;
        let minOverallCount = Infinity;

        for (const group of candidates) {
          const cat = d.category || "Others";
          const catCount = categoryGroupCounts[group][cat] || 0;
          const overallCount = groupCounts[group] || 0;

          if (catCount < minCategoryCount) {
            minCategoryCount = catCount;
            minOverallCount = overallCount;
            bestGroup = group;
          } else if (catCount === minCategoryCount) {
            if (overallCount < minOverallCount) {
              minOverallCount = overallCount;
              bestGroup = group;
            }
          }
        }
        const assignedGroup = bestGroup;

        const cat = d.category || "Others";
        groupCounts[assignedGroup]++;
        categoryGroupCounts[assignedGroup][cat]++;

        assignGroup(d.id, assignedGroup, "None");
      }
    });
    setSelectedIds([]);
  };

  const handleBulkClearGroup = () => {
    selectedIds.forEach((id) => {
      assignGroup(id, "None", "None");
    });
    setSelectedIds([]);
  };

  const handleBulkEmailOpen = () => {
    const emails = delegates
      .filter((d) => selectedIds.includes(d.id))
      .map((d) => d.email);
    setEmailRecipients(emails);
    setEmailSubject("HTC Camp Announcement");
    setEmailBody("Dear {{full_name}},\n\n");
    setEmailSuccessMsg("");
    setEmailProgress(null);
    setShowEmailModal(true);
  };

  const handleSingleEmailOpen = (delegate: Delegate) => {
    setEmailRecipients([delegate.email]);
    setEmailSubject("HTC Registration Update");
    setEmailBody(`Dear {{full_name}},\n\nYour HTC registration is: {{htc_id}}.\nYour assigned group is: {{assigned_group}}.`);
    setEmailSuccessMsg("");
    setEmailProgress(null);
    setShowEmailModal(true);
  };

  // Smart variable injection
  const injectVariable = (variable: string) => {
    const textarea = bodyTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;

    const updatedText = text.substring(0, startPos) + variable + text.substring(endPos);
    setEmailBody(updatedText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + variable.length, startPos + variable.length);
    }, 0);
  };

  const handleDispatchEmail = async () => {
    setEmailSuccessMsg("");
    await sendBulkEmail(emailSubject, emailBody, emailRecipients, (p) => {
      setEmailProgress(p);
    });
    setEmailProgress(null);
    setEmailSuccessMsg(`Successfully dispatched announcements to ${emailRecipients.length} recipients!`);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSuccessMsg("");
    }, 1500);
  };

  // Paystack verification simulator
  const handleLookupReference = () => {
    if (!paystackLookupRef.trim()) return;
    setIsVerifyingRef(true);
    setPaystackFound(null);
    setTimeout(() => {
      setIsVerifyingRef(false);
      // Simulate that reference is valid
      setPaystackFound(true);
    }, 1200);
  };

  const handleManualOverride = (reference: string) => {
    overridePayment(reference);
    setVerifyingDelegate(null);
    setPaystackLookupRef("");
    setPaystackFound(null);
  };

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
      {/* Header toolbar */}
      <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Operations Master Grid</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">MSSN Ikeja Area Council Encampment Gateway</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full">
            Session Sec-Access Active
          </span>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-surface-container-low border border-outline-variant p-4 rounded-2xl shadow-sm">
        <div className="flex flex-1 min-w-[240px] items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant focus-within:border-primary focus-within:ring-4 focus-within:ring-accent/20 transition-all">
          <Search className="text-on-surface-variant w-4 h-4" />
          <input
            type="text"
            placeholder="Search delegates by name, email, HTC-ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full focus:ring-0 placeholder:text-on-surface-variant/75"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-32 sm:w-40">
            <CustomSelect
              label="Gender"
              options={GENDER_FILTER_OPTIONS}
              value={filterGender}
              onChange={setFilterGender}
            />
          </div>

          <div className="w-32 sm:w-40">
            <CustomSelect
              label="Category"
              options={CATEGORY_FILTER_OPTIONS}
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>

          <div className="w-32 sm:w-40">
            <CustomSelect
              label="Payment"
              options={PAYMENT_FILTER_OPTIONS}
              value={filterStatus}
              onChange={setFilterStatus}
            />
          </div>
        </div>
      </div>

      {/* Selection Bulk Actions Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between animate-fade-in shadow-sm">
          <span className="text-xs font-bold text-primary">
            {selectedIds.length} delegates selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkAutoGroup}
              className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all flex items-center gap-1 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Group
            </button>
            <button
              onClick={handleBulkClearGroup}
              className="px-3 py-2 border border-outline text-on-surface text-xs font-bold rounded-lg hover:bg-white transition-all flex items-center gap-1"
            >
              <Ban className="w-3.5 h-3.5" />
              Clear Groups
            </button>
            <button
              onClick={handleBulkEmailOpen}
              className="px-3 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent/90 transition-all flex items-center gap-1 shadow"
            >
              <Mail className="w-3.5 h-3.5" />
              Email Selected
            </button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="flex-1 overflow-auto border border-outline-variant rounded-2xl bg-surface-container-low shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant font-bold text-on-surface-variant select-none">
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredDelegates.length && filteredDelegates.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-outline-variant"
                />
              </th>
              <th className="p-4">Reference/ID</th>
              <th className="p-4">Delegate Name</th>
              <th className="p-4">Details</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Induction Group</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface-container-lowest">
            {filteredDelegates.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-on-surface-variant font-medium">
                  No registrations matching current filter criteria.
                </td>
              </tr>
            ) : (
              filteredDelegates.map((d) => (
                <tr key={d.id} className="hover:bg-surface-container/20 transition-colors">
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(d.id)}
                      onChange={(e) => handleSelectRow(d.id, e.target.checked)}
                      className="rounded border-outline-variant"
                    />
                  </td>
                  <td className="p-4 font-mono font-bold leading-normal">
                    <span className="text-[11px] block">{d.id.startsWith("pending") ? "PENDING" : d.id}</span>
                    <span className="text-[9px] text-on-surface-variant/80 block mt-0.5">{d.reference}</span>
                  </td>
                  <td className="p-4 font-bold">
                    <span className="block text-sm font-bold">{d.fullName}</span>
                    <span className="block text-[10px] text-on-surface-variant font-medium mt-0.5">{d.email}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="font-semibold text-primary">{d.category}</span>
                      {d.category === "Secondary School" && (
                        <span className="text-[10px] text-on-surface-variant block">
                          School: {d.school} | Dist: {d.secondaryDistrict} | Class: {d.secondaryClass}
                        </span>
                      )}
                      {d.category === "Undergraduate/Leaver" && (
                        <span className="text-[10px] text-on-surface-variant block">
                          Uni: {d.school} | Course: {d.courseOfStudy} | Year: {d.yearOfStudy}
                        </span>
                      )}
                      {d.category === "Others" && (
                        <span className="text-[10px] text-on-surface-variant block">
                          Company: {d.school} | Job: {d.jobTitle} | Mode: {d.employmentMode}
                        </span>
                      )}
                      <span className="text-[10px] text-on-surface-variant/80 font-medium block mt-0.5">Gender: {d.gender} | Skill: {d.skillOfInterest || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 font-bold rounded-full text-[9px] ${
                      d.paymentStatus === "verified"
                        ? "bg-success/15 text-success border border-success/20"
                        : "bg-error/15 text-error border border-error/20"
                    }`}>
                      {d.paymentStatus === "verified" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="p-4">
                    <CustomSelect
                      size="compact"
                      disabled={d.paymentStatus !== "verified"}
                      value={d.assignedGroup}
                      onChange={(val) => handleInlineGroupChange(d.id, val)}
                      options={GROUP_OPTIONS}
                    />
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/admin/dashboard/delegate/${d.id}`}
                        className="p-1 border border-outline text-on-surface hover:text-primary rounded hover:bg-surface-container transition-colors"
                        title="View Full Profile Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      {d.paymentStatus === "pending" && (
                        <button
                          onClick={() => setVerifyingDelegate(d)}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition-colors shadow-sm"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleSingleEmailOpen(d)}
                        className="p-1 border border-outline text-on-surface hover:text-primary rounded hover:bg-surface-container transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Verification Center Overlay Drawer */}
      {verifyingDelegate && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border-l border-outline-variant max-w-md w-full h-full p-6 flex flex-col gap-6 animate-slide-in relative">
            <button
              onClick={() => {
                setVerifyingDelegate(null);
                setPaystackLookupRef("");
                setPaystackFound(null);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Transaction Verification Center
            </h3>

            <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant">
              <p className="text-xs font-semibold">Delegate Details</p>
              <div className="grid grid-cols-2 gap-1 text-[11px] mt-2 leading-relaxed">
                <span className="text-on-surface-variant">Name:</span>
                <span className="font-bold text-right truncate">{verifyingDelegate.fullName}</span>
                <span className="text-on-surface-variant">Email:</span>
                <span className="font-bold text-right truncate">{verifyingDelegate.email}</span>
                <span className="text-on-surface-variant">Category:</span>
                <span className="font-bold text-right">{verifyingDelegate.category}</span>
                <span className="text-on-surface-variant">Skill of Interest:</span>
                <span className="font-bold text-right truncate">{verifyingDelegate.skillOfInterest || "N/A"}</span>
                {verifyingDelegate.category === "Secondary School" && (
                  <>
                    <span className="text-on-surface-variant">School:</span>
                    <span className="font-bold text-right truncate">{verifyingDelegate.school}</span>
                    <span className="text-on-surface-variant">Class:</span>
                    <span className="font-bold text-right">{verifyingDelegate.secondaryClass}</span>
                  </>
                )}
                {verifyingDelegate.category === "Undergraduate/Leaver" && (
                  <>
                    <span className="text-on-surface-variant">Uni:</span>
                    <span className="font-bold text-right truncate">{verifyingDelegate.school}</span>
                    <span className="text-on-surface-variant">Course:</span>
                    <span className="font-bold text-right truncate">{verifyingDelegate.courseOfStudy}</span>
                  </>
                )}
                {verifyingDelegate.category === "Others" && (
                  <>
                    <span className="text-on-surface-variant">Company:</span>
                    <span className="font-bold text-right truncate">{verifyingDelegate.school}</span>
                    <span className="text-on-surface-variant">Job:</span>
                    <span className="font-bold text-right truncate">{verifyingDelegate.jobTitle}</span>
                  </>
                )}
                <span className="text-on-surface-variant">Blood Group:</span>
                <span className="font-bold text-right">{verifyingDelegate.bloodGroup || "N/A"}</span>
                <span className="text-on-surface-variant">Genotype:</span>
                <span className="font-bold text-right">{verifyingDelegate.genotype || "N/A"}</span>
                <span className="text-on-surface-variant">Medical Summary:</span>
                <span className="font-bold text-right truncate text-error-red">{verifyingDelegate.medicalCondition}</span>
                <span className="text-on-surface-variant">Ref ID:</span>
                <span className="font-mono text-right font-semibold">{verifyingDelegate.reference}</span>
                <span className="text-on-surface-variant">Status:</span>
                <span className="text-error font-bold text-right">Payment Pending</span>
              </div>
            </div>

            {/* Paystack reference search widget */}
            <div className="flex flex-col gap-3 p-4 border border-outline-variant rounded-xl bg-surface-container-low">
              <h4 className="text-xs font-bold">Paystack Lookup Integration Widget</h4>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Retrieve live processor statuses matching reference ID.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste reference REF-XXXX"
                  value={paystackLookupRef}
                  onChange={(e) => {
                    setPaystackLookupRef(e.target.value);
                    setPaystackFound(null);
                  }}
                  className="flex-1 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant text-xs focus:outline-none"
                />
                <button
                  onClick={handleLookupReference}
                  disabled={isVerifyingRef}
                  className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-colors disabled:opacity-50"
                >
                  {isVerifyingRef ? "Searching..." : "Lookup"}
                </button>
              </div>

              {paystackFound === true && (
                <div className="p-2 bg-success/15 border border-success/20 text-success rounded text-[11px] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  Processor confirmed payment successfully!
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={() => handleManualOverride(verifyingDelegate.reference)}
                className="w-full py-3 bg-success hover:bg-success/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Manually Confirm Payment
              </button>
              <button
                onClick={() => {
                  setVerifyingDelegate(null);
                  setPaystackLookupRef("");
                  setPaystackFound(null);
                }}
                className="w-full py-3 border border-outline text-on-surface font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all hover:bg-slate-50"
              >
                Cancel Override
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rich Email Dispatch Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-lg w-full p-6 flex flex-col gap-5 relative">
            <button
              onClick={() => {
                if (emailProgress === null) setShowEmailModal(false);
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
              disabled={emailProgress !== null}
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Rich Announcement Dispatch
            </h3>

            {/* Recipient Tally */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center bg-primary/5 p-3 rounded-lg border border-primary/10">
                <span className="text-xs font-bold text-primary">
                  Recipients Selected: {emailRecipients.length}
                </span>
                <span className="text-[9px] text-on-surface-variant font-mono">
                  {emailRecipients.length > 5 ? `${emailRecipients.slice(0, 5).join(", ")}...` : emailRecipients.join(", ")}
                </span>
              </div>
            </div>

            {/* Form Subject */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface-variant">Subject Line</label>
              <input
                type="text"
                disabled={emailProgress !== null}
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="HTC July Session Info Update"
                className="w-full px-4 py-2.5 bg-surface-container rounded-lg border border-outline-variant text-sm focus:outline-none"
              />
            </div>

            {/* Form Body and Variable injection */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-on-surface-variant">Rich Announcement Body</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => injectVariable("{{full_name}}")}
                    className="px-2 py-0.5 bg-surface-container border border-outline-variant rounded text-[10px] font-bold text-primary hover:bg-slate-100"
                  >
                    + Name
                  </button>
                  <button
                    onClick={() => injectVariable("{{htc_id}}")}
                    className="px-2 py-0.5 bg-surface-container border border-outline-variant rounded text-[10px] font-bold text-primary hover:bg-slate-100"
                  >
                    + HTC ID
                  </button>
                  <button
                    onClick={() => injectVariable("{{assigned_group}}")}
                    className="px-2 py-0.5 bg-surface-container border border-outline-variant rounded text-[10px] font-bold text-primary hover:bg-slate-100"
                  >
                    + Group
                  </button>
                </div>
              </div>
              <textarea
                ref={bodyTextareaRef}
                disabled={emailProgress !== null}
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container rounded-lg border border-outline-variant text-xs focus:outline-none font-sans leading-relaxed resize-none"
              />
            </div>

            {/* Real-time sending progress bar */}
            {emailProgress !== null && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-primary">
                  <span>Sending announcements...</span>
                  <span>{emailProgress}%</span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-100"
                    style={{ width: `${emailProgress}%` }}
                  />
                </div>
              </div>
            )}

            {emailSuccessMsg && (
              <div className="p-3 bg-success/15 border border-success/20 text-success rounded-lg text-xs font-bold text-center">
                {emailSuccessMsg}
              </div>
            )}

            {/* Actions */}
            {emailProgress === null && !emailSuccessMsg && (
              <button
                onClick={handleDispatchEmail}
                disabled={!emailSubject || !emailBody || emailRecipients.length === 0}
                className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
                Dispatch Announcement Emails
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
