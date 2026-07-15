"use client";

import React, { use, useState } from "react";
import { useAppState, getDelegateFee } from "@/context/app-state";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  Award,
  Stethoscope,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
} from "lucide-react";

export default function DelegateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { delegates, overridePayment, assignGroup, settings } = useAppState();

  const [paystackLookupRef, setPaystackLookupRef] = useState("");
  const [paystackFound, setPaystackFound] = useState<boolean | null>(null);
  const [isVerifyingRef, setIsVerifyingRef] = useState(false);

  const delegate = delegates.find((d) => d.id === id || d.reference === id);

  if (!delegate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <ShieldAlert className="w-12 h-12 text-error animate-pulse" />
        <h2 className="text-xl font-bold">Delegate Profile Not Found</h2>
        <p className="text-xs text-on-surface-variant max-w-sm">
          No delegate records match identifier '{id}'.
        </p>
        <button
          onClick={() => router.push("/admin/dashboard/operations")}
          className="px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-lg shadow hover:bg-primary/95 transition-all"
        >
          Return to Operations Grid
        </button>
      </div>
    );
  }

  // Processor lookup simulator
  const handleLookupReference = () => {
    setIsVerifyingRef(true);
    setPaystackFound(null);
    setTimeout(() => {
      setIsVerifyingRef(false);
      setPaystackFound(true);
    }, 1000);
  };

  const handleManualOverride = () => {
    overridePayment(delegate.reference);
    setPaystackLookupRef("");
    setPaystackFound(null);
  };

  const handleGroupSelect = (groupName: string) => {
    assignGroup(delegate.id, groupName, "None");
  };

  const totalFee = getDelegateFee(delegate.category, delegate.yearOfStudy, settings.campFeeSecondary, settings.campFeeUndergrad);

  return (
    <div className="flex flex-col gap-6 flex-1 max-w-5xl mx-auto pb-12">
      {/* Back button and page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/dashboard/operations")}
          className="p-2 hover:bg-surface-container border border-outline-variant rounded-lg transition-colors text-on-surface"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Delegate Profile Details</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">MSSN Ikeja Area Council Encampment Registry Database</p>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shrink-0">
            {delegate.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg md:text-xl font-bold text-on-surface">{delegate.fullName}</h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-on-surface-variant">
              <span>{delegate.id.startsWith("pending") ? "PENDING TICKET" : delegate.id}</span>
              <span className="text-outline/50">•</span>
              <span>{delegate.email}</span>
              <span className="text-outline/50">•</span>
              <span>{delegate.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 font-bold rounded-full text-xs border ${
            delegate.paymentStatus === "verified"
              ? "bg-success/15 text-success border-success/20"
              : "bg-error/15 text-error border-error/20"
          }`}>
            {delegate.paymentStatus === "verified" ? "Paid" : "Pending"}
          </span>
        </div>
        
        <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column (Personal & Academic Info) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Card 1: Registration Details */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <User className="w-4 h-4 text-primary" />
              Delegate Demographics & Category
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Category</span>
                <span className="font-semibold text-primary">{delegate.category}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Gender</span>
                <span className="font-semibold">{delegate.gender}</span>
              </div>
              
              {delegate.category === "Secondary School" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Secondary School Name</span>
                    <span className="font-semibold">{delegate.school}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">District</span>
                    <span className="font-semibold">{delegate.secondaryDistrict}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Class Level</span>
                    <span className="font-semibold">{delegate.secondaryClass}</span>
                  </div>
                </>
              )}

              {delegate.category === "Undergraduate/Leaver" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">University / Institute</span>
                    <span className="font-semibold">{delegate.school}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Course of Study</span>
                    <span className="font-semibold">{delegate.courseOfStudy}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Year of Study</span>
                    <span className="font-semibold">{delegate.yearOfStudy}</span>
                  </div>
                </>
              )}

              {delegate.category === "Others" && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Institution / Company</span>
                    <span className="font-semibold">{delegate.school}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Job Title</span>
                    <span className="font-semibold">{delegate.jobTitle}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-on-surface-variant font-bold">Employment Mode</span>
                    <span className="font-semibold">{delegate.employmentMode}</span>
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Skill of Interest Selection</span>
                <span className="font-semibold text-accent">{delegate.skillOfInterest || "None Selected"}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Medical Summary Profile */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <Stethoscope className="w-4 h-4 text-primary" />
              Medical & Nutritional Information Profile
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Blood Group</span>
                <span className="font-semibold">{delegate.bloodGroup || "Not Provided"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Genotype</span>
                <span className="font-semibold">{delegate.genotype || "Not Provided"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 text-xs mt-2">
              <span className="text-on-surface-variant font-bold">Allergies & Dietary Restrictions Toggles</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className={`p-3 rounded-xl border flex items-center justify-between font-semibold ${
                  delegate.nutAllergy ? "bg-red-50 border-red-200 text-error" : "bg-surface-container-high border-outline-variant"
                }`}>
                  <span>Nut Allergy</span>
                  <span>{delegate.nutAllergy ? "Yes" : "No"}</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between font-semibold ${
                  delegate.lactoseIntolerance ? "bg-red-50 border-red-200 text-error" : "bg-surface-container-high border-outline-variant"
                }`}>
                  <span>Lactose Intolerant</span>
                  <span>{delegate.lactoseIntolerance ? "Yes" : "No"}</span>
                </div>
                <div className={`p-3 rounded-xl border flex items-center justify-between font-semibold ${
                  delegate.medicationAllergy ? "bg-red-50 border-red-200 text-error" : "bg-surface-container-high border-outline-variant"
                }`}>
                  <span>Drug Allergy</span>
                  <span>{delegate.medicationAllergy ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            {delegate.otherAllergies && (
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-on-surface-variant font-bold">Other Specific Allergies</span>
                <span className="font-semibold bg-surface-container-high p-3 border border-outline-variant rounded-xl">{delegate.otherAllergies}</span>
              </div>
            )}

            {delegate.chronicConditions && (
              <div className="flex flex-col gap-1 text-xs">
                <span className="text-on-surface-variant font-bold">Chronic Medical Conditions</span>
                <span className="font-semibold bg-surface-container-high p-3 border border-outline-variant rounded-xl text-error-red">{delegate.chronicConditions}</span>
              </div>
            )}

            <div className="flex flex-col gap-1 text-xs">
              <span className="text-on-surface-variant font-bold">General Compiled Medical Summary Description</span>
              <p className="font-semibold bg-surface-container-high p-4 border border-outline-variant rounded-xl leading-relaxed">
                {delegate.medicalCondition || "No specific medical guidelines recorded."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Emergency Contact, Allocation, Payment Actions) */}
        <div className="flex flex-col gap-6">
          {/* Allocation & Logistics Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <MapPin className="w-4 h-4 text-primary" />
              Group Allocation
            </h4>
            
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-bold">Camp Induction Group</span>
                {delegate.paymentStatus === "verified" ? (
                  <select
                    value={delegate.assignedGroup}
                    onChange={(e) => handleGroupSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container border border-outline-variant rounded-lg text-xs focus:outline-none cursor-pointer mt-1"
                  >
                    <option value="None">None</option>
                    <option value="Abu Bakr">Abu Bakr (Male)</option>
                    <option value="Umar">Umar (Male)</option>
                    <option value="Uthman">Uthman (Male)</option>
                    <option value="Ali">Ali (Male)</option>
                    <option value="Aisha">Aisha (Female)</option>
                    <option value="Khadijah">Khadijah (Female)</option>
                    <option value="Fatimah">Fatimah (Female)</option>
                    <option value="Zaynab">Zaynab (Female)</option>
                  </select>
                ) : (
                  <span className="font-semibold text-on-surface-variant bg-surface-container-high p-2 rounded border border-outline-variant mt-1 block">
                    Verify payment to assign group
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Emergency Contact Card */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <Phone className="w-4 h-4 text-primary" />
              Emergency Contact
            </h4>
            
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant font-bold">Contact Person Name</span>
                <span className="font-semibold text-sm">{delegate.emergencyContactName}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-on-surface-variant font-bold">Emergency Phone Line</span>
                <span className="font-semibold text-sm text-primary">{delegate.emergencyContactPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment & Audit Section */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h4 className="font-bold text-sm text-primary flex items-center gap-2 border-b border-outline-variant/30 pb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              Camp Fee Transactions
            </h4>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-on-surface-variant">Camp Fee Rate:</span>
                <span className="text-primary font-bold">₦{totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-on-surface-variant">Reference ID:</span>
                <span className="font-mono font-bold">{delegate.reference}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-on-surface-variant">Registration Date:</span>
                <span className="font-semibold">{new Date(delegate.createdAt).toLocaleDateString()}</span>
              </div>

              {delegate.paymentStatus === "pending" ? (
                <div className="flex flex-col gap-3 border-t border-outline-variant/30 pt-4 mt-2">
                  <span className="text-xs font-bold">Paystack Verification widget</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Processor lookup REF..."
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

                  {paystackFound && (
                    <div className="p-2.5 bg-success/15 border border-success/20 text-success rounded text-[11px] font-semibold flex items-center gap-1.5 animate-fade-in">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Processor confirmed transaction!
                    </div>
                  )}

                  <button
                    onClick={handleManualOverride}
                    className="w-full py-3 bg-success hover:bg-success/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow"
                  >
                    <ShieldCheck className="w-4 h-4 text-white" />
                    Manually Confirm Payment
                  </button>
                </div>
              ) : (
                <div className="bg-success/10 border border-success/20 p-3 rounded-xl flex items-center gap-2 text-success font-bold mt-2">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  Payment Verified Successfully
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
