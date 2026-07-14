"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppState, Delegate, getDelegateFee } from "@/context/app-state";
import { CustomSelect } from "@/components/custom-select";
import {
  ShieldAlert,
  BarChart3,
  Database,
  Settings,
  LogOut,
  Search,
  Sparkles,
  Ban,
  Mail,
  X,
  CreditCard,
  ShieldCheck,
  Send,
  Save
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
  { value: "Verified", label: "Verified" },
  { value: "Pending", label: "Pending" },
];

const GROUP_OPTIONS = [
  { value: "None", label: "None" },
  { value: "Abu Bakr", label: "Abu Bakr" },
  { value: "Umar", label: "Umar" },
  { value: "Aisha", label: "Aisha" },
  { value: "Khadijah", label: "Khadijah" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const {
    delegates,
    settings,
    isAdminLoggedIn,
    logoutAdmin,
    overridePayment,
    assignGroup,
    autoGroupDelegates,
    sendBulkEmail,
    updateSettings,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<"overview" | "operations" | "settings">("overview");
  
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

  // Settings form states
  const [settingsForm, setSettingsForm] = useState({
    campFee: settings.campFee,
    capacityLimit: settings.capacityLimit,
    startDate: settings.startDate,
    endDate: settings.endDate,
    autoGroupingEnabled: settings.autoGroupingEnabled,
  });

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push("/admin/login");
    }
  }, [isAdminLoggedIn, router]);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
    let roomName = "None";
    if (groupName !== "None") {
      roomName = `Room ${Math.floor(Math.random() * 5) + 1}`;
    }
    assignGroup(delegateId, groupName, roomName);
  };

  // Bulk actions
  const handleBulkAutoGroup = () => {
    selectedIds.forEach((id) => {
      const d = delegates.find((x) => x.id === id);
      if (d && d.paymentStatus === "verified" && d.assignedGroup === "None") {
        let assignedGroup = "None";
        let assignedRoom = "None";
        if (d.gender === "Male") {
          assignedGroup = d.category === "Secondary School" ? "Umar" : "Abu Bakr";
          assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
        } else {
          assignedGroup = d.category === "Secondary School" ? "Khadijah" : "Aisha";
          assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
        }
        assignGroup(d.id, assignedGroup, assignedRoom);
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
    setEmailBody(`Dear {{full_name}},\n\nYour HTC registration is: {{htc_id}}.\nYour assigned room is: {{assigned_group}}.`);
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

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    alert("Camp settings updated successfully!");
  };

  // Overall analytics calculation
  const totalVerified = delegates.filter((d) => d.paymentStatus === "verified").length;
  const totalRegistrations = delegates.length;
  const totalPending = totalRegistrations - totalVerified;
  const totalFinancials = delegates.filter((d) => d.paymentStatus === "verified").reduce((sum, d) => sum + getDelegateFee(d.category, d.yearOfStudy), 0);
  const totalUngrouped = delegates.filter((d) => d.paymentStatus === "verified" && d.assignedGroup === "None").length;

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col md:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full md:w-[280px] shrink-0 bg-surface-container-low border-b md:border-r border-outline-variant p-6 flex flex-col gap-6 md:h-screen md:sticky md:top-0">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-primary w-7 h-7" />
          <h1 className="text-xl font-extrabold text-primary tracking-tight">HTC Operations</h1>
        </div>

        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === "overview"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Executive Overview
          </button>
          <button
            onClick={() => setActiveTab("operations")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === "operations"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Database className="w-5 h-5" />
            Operations Grid
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full px-4 py-3 rounded-lg text-left text-sm font-bold flex items-center gap-3 transition-colors ${
              activeTab === "settings"
                ? "bg-primary text-white"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            <Settings className="w-5 h-5" />
            Camp Settings
          </button>
        </nav>

        <button
          onClick={logoutAdmin}
          className="mt-auto px-4 py-3 border border-outline text-error font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          End Secure Session
        </button>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-6 md:p-10 flex flex-col gap-6 overflow-hidden">
        {/* Header toolbar */}
        <div className="flex justify-between items-center pb-4 border-b border-outline-variant">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              {activeTab === "overview" && "Executive Overview"}
              {activeTab === "operations" && "Operations Master Grid"}
              {activeTab === "settings" && "System Settings"}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">MSSN Ikeja Area Council Encampment Gateway</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold rounded-full">
              Session Sec-Access Active
            </span>
          </div>
        </div>

        {/* Tab 1: Executive Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            {/* Numeric metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Total Registrants</span>
                <span className="text-3xl font-extrabold">{totalRegistrations}</span>
                <div className="text-xs text-on-surface-variant mt-1 flex justify-between">
                  <span>Verified: {totalVerified}</span>
                  <span>Pending: {totalPending}</span>
                </div>
                <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Verified Financials</span>
                <span className="text-3xl font-extrabold text-success">₦{totalFinancials.toLocaleString()}</span>
                <span className="text-xs text-on-surface-variant mt-1">Receipts matching verified payments</span>
                <div className="absolute top-0 left-0 h-full w-1 bg-success" />
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Verification</span>
                <span className="text-3xl font-extrabold text-amber-600">{totalPending}</span>
                <span className="text-xs text-on-surface-variant mt-1">Requires manual audit override</span>
                <div className="absolute top-0 left-0 h-full w-1 bg-amber-500" />
              </div>

              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden shadow-sm">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Ungrouped / Unallocated</span>
                <span className="text-3xl font-extrabold text-indigo-600">{totalUngrouped}</span>
                <span className="text-xs text-on-surface-variant mt-1">Verified delegates with no group</span>
                <div className="absolute top-0 left-0 h-full w-1 bg-indigo-500" />
              </div>
            </div>

            {/* Quick Operations panel */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Group summaries */}
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                <h3 className="font-bold text-base text-primary">Group & Room Breakdown</h3>
                <p className="text-xs text-on-surface-variant">Allocated group distribution for verified delegates.</p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
                    <p className="text-xs text-on-surface-variant font-semibold">Abu Bakr (Male Undergrads)</p>
                    <p className="text-xl font-extrabold text-primary">
                      {delegates.filter((d) => d.assignedGroup === "Abu Bakr").length}
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
                    <p className="text-xs text-on-surface-variant font-semibold">Umar (Male Students)</p>
                    <p className="text-xl font-extrabold text-primary">
                      {delegates.filter((d) => d.assignedGroup === "Umar").length}
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
                    <p className="text-xs text-on-surface-variant font-semibold">Aisha (Female Undergrads)</p>
                    <p className="text-xl font-extrabold text-primary">
                      {delegates.filter((d) => d.assignedGroup === "Aisha").length}
                    </p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl border border-outline-variant text-center">
                    <p className="text-xs text-on-surface-variant font-semibold">Khadijah (Female Students)</p>
                    <p className="text-xl font-extrabold text-primary">
                      {delegates.filter((d) => d.assignedGroup === "Khadijah").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick actions panel */}
              <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4 shadow-sm">
                <h3 className="font-bold text-base text-primary">Automated Computational Actions</h3>
                <p className="text-xs text-on-surface-variant">Bulk operations tools to manage room assignment triggers.</p>
                <div className="flex flex-col gap-3 mt-2">
                  <button
                    onClick={() => {
                      autoGroupDelegates();
                      alert("Successfully triggers automatic room assignment rules!");
                    }}
                    className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary/95 transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Run Auto-Grouping Rule Engine
                  </button>
                  <p className="text-[10px] text-on-surface-variant text-center">
                    Allocates all ungrouped verified delegates to rooms matching their gender and category.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Operations Master Grid */}
        {activeTab === "operations" && (
          <div className="flex flex-col gap-6 flex-1 overflow-hidden">
            {/* Filters toolbar */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-surface-container-low border border-outline-variant p-4 rounded-2xl">
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
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center justify-between animate-fade-in">
                <span className="text-xs font-bold text-primary">
                  {selectedIds.length} delegates selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkAutoGroup}
                    className="px-3 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all flex items-center gap-1"
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
                    className="px-3 py-2 bg-accent text-white text-xs font-bold rounded-lg hover:bg-accent/90 transition-all flex items-center gap-1"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email Selected
                  </button>
                </div>
              </div>
            )}

            {/* Data Grid */}
            <div className="flex-1 overflow-auto border border-outline-variant rounded-2xl bg-surface-container-low">
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
                          <div className="flex flex-col gap-0.5">
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
                            <span className="text-[10px] text-on-surface-variant/80 font-medium block">Gender: {d.gender}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 font-bold rounded-full text-[9px] ${
                            d.paymentStatus === "verified"
                              ? "bg-success/15 text-success border border-success/20"
                              : "bg-error/15 text-error border border-error/20"
                          }`}>
                            {d.paymentStatus === "verified" ? "Verified" : "Pending"}
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
                          {d.assignedRoom !== "None" && (
                            <span className="text-[10px] block mt-1 text-on-surface-variant font-mono">{d.assignedRoom}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            {d.paymentStatus === "pending" && (
                              <button
                                onClick={() => setVerifyingDelegate(d)}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold transition-colors"
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
          </div>
        )}

        {/* Tab 3: System Settings */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-surface-container-low border border-outline-variant p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-base text-primary mb-4">Camp System Configurations</h3>
            
            <form onSubmit={handleSaveSettings} className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                  <label className="text-xs font-semibold text-on-surface-variant">Camp Registration Fee Structure (₦)</label>
                  <div className="p-3 bg-surface-container border border-outline-variant rounded-lg text-xs font-medium text-on-surface-variant flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span>Secondary / Leavers:</span>
                      <span className="font-bold text-primary">₦4,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Undergraduates / Others:</span>
                      <span className="font-bold text-primary">₦6,000</span>
                    </div>
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
                  <p className="text-xs font-bold">Automatic Room Assignment Rule Engine</p>
                  <p className="text-[10px] text-on-surface-variant">Trigger room induction automatically when payments confirm.</p>
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
        )}
      </main>

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
              <div className="grid grid-cols-2 gap-1 text-[11px] mt-2">
                <span className="text-on-surface-variant">Name:</span>
                <span className="font-bold text-right truncate">{verifyingDelegate.fullName}</span>
                <span className="text-on-surface-variant">Email:</span>
                <span className="font-bold text-right truncate">{verifyingDelegate.email}</span>
                <span className="text-on-surface-variant">Category:</span>
                <span className="font-bold text-right">{verifyingDelegate.category}</span>
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
