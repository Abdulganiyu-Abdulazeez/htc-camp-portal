"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState, getDelegateFee } from "@/context/app-state";
import { CustomSelect } from "@/components/custom-select";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  X,
  GraduationCap,
  BookOpen,
  Briefcase,
  Lock
} from "lucide-react";

const DISTRICT_OPTIONS = [
  { value: "District 1", label: "District 1" },
  { value: "District 2", label: "District 2" },
  { value: "District 3", label: "District 3" },
  { value: "District 4", label: "District 4" },
  { value: "District 5", label: "District 5" },
  { value: "District 6", label: "District 6" },
];

const CLASS_OPTIONS = [
  { value: "JSS 1", label: "JSS 1" },
  { value: "JSS 2", label: "JSS 2" },
  { value: "JSS 3", label: "JSS 3" },
  { value: "SSS 1", label: "SSS 1" },
  { value: "SSS 2", label: "SSS 2" },
  { value: "SSS 3", label: "SSS 3" },
];

const YEAR_OPTIONS = [
  { value: "Prospective Candidate", label: "Prospective Candidate" },
  { value: "100 Level", label: "100 Level" },
  { value: "200 Level", label: "200 Level" },
  { value: "300 Level", label: "300 Level" },
  { value: "400 Level", label: "400 Level" },
  { value: "500 Level", label: "500 Level" },
  { value: "600 Level", label: "600 Level" },
  { value: "700 Level", label: "700 Level (Medical/Vet)" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Freelance", label: "Freelance" },
  { value: "Self-Employed", label: "Self-Employed" },
  { value: "Unemployed", label: "Unemployed" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerDelegate, confirmPayment, loginAsDelegate, settings } = useAppState();
  const currentFee = getDelegateFee(formData.category, formData.yearOfStudy);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Male" as "Male" | "Female",
    category: "Secondary School" as "Secondary School" | "Undergraduate/Leaver" | "Others",
    school: "", // Secondary School Name, University, or Company Name
    secondaryDistrict: "District 1",
    secondaryClass: "JSS 1",
    courseOfStudy: "",
    yearOfStudy: "Prospective Candidate",
    jobTitle: "",
    employmentMode: "Full-Time",
    nutAllergy: false,
    lactoseIntolerance: false,
    medicationAllergy: false,
    otherAllergies: "",
    chronicConditions: "",
    bloodGroup: "O+",
    genotype: "AA",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPaystackOverlay, setShowPaystackOverlay] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [currentRef, setCurrentRef] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
      if (!formData.email.trim()) {
        newErrors.email = "Email address is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required.";
      } else if (formData.phone.length < 10) {
        newErrors.phone = "Please enter a valid phone number.";
      }
    } else if (step === 2) {
      if (formData.category === "Secondary School") {
        if (!formData.school.trim()) newErrors.school = "Secondary School name is required.";
        if (!formData.secondaryDistrict.trim()) newErrors.secondaryDistrict = "District name is required.";
      } else if (formData.category === "Undergraduate/Leaver") {
        if (!formData.school.trim()) newErrors.school = "University name is required.";
        if (!formData.courseOfStudy.trim()) newErrors.courseOfStudy = "Course of study is required.";
      } else if (formData.category === "Others") {
        if (!formData.jobTitle.trim()) newErrors.jobTitle = "Job title is required.";
        if (!formData.school.trim()) newErrors.school = "Company name is required.";
      }
    } else if (step === 3) {
      if (!formData.emergencyContactName.trim()) {
        newErrors.emergencyContactName = "Emergency contact name is required.";
      }
      if (!formData.emergencyContactPhone.trim()) {
        newErrors.emergencyContactPhone = "Emergency contact phone is required.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      // Compile comprehensive description of medical conditions
      const allergies = [];
      if (formData.nutAllergy) allergies.push("Nut Allergy");
      if (formData.lactoseIntolerance) allergies.push("Lactose Intolerance");
      if (formData.medicationAllergy) allergies.push("Medication Allergy");
      if (formData.otherAllergies.trim()) allergies.push(formData.otherAllergies.trim());

      const allergySummary = allergies.length > 0 ? `Allergies: ${allergies.join(", ")}` : "";
      const chronicSummary = formData.chronicConditions.trim() ? `Conditions: ${formData.chronicConditions.trim()}` : "";
      const compiledMedical = [allergySummary, chronicSummary].filter(Boolean).join(" | ") || "None";

      const newD = registerDelegate({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
        category: formData.category,
        school: formData.school || "N/A",
        secondaryDistrict: formData.secondaryDistrict || undefined,
        secondaryClass: formData.secondaryClass || undefined,
        courseOfStudy: formData.courseOfStudy || undefined,
        yearOfStudy: formData.yearOfStudy || undefined,
        jobTitle: formData.jobTitle || undefined,
        employmentMode: formData.employmentMode || undefined,
        medicalCondition: compiledMedical,
        nutAllergy: formData.nutAllergy,
        lactoseIntolerance: formData.lactoseIntolerance,
        medicationAllergy: formData.medicationAllergy,
        otherAllergies: formData.otherAllergies,
        chronicConditions: formData.chronicConditions,
        bloodGroup: formData.bloodGroup,
        genotype: formData.genotype,
        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
      });
      setCurrentRef(newD.reference);
      setShowPaystackOverlay(true);
    }
  };

  const simulateSuccessPayment = () => {
    setIsPaying(true);
    setTimeout(() => {
      confirmPayment(currentRef);
      loginAsDelegate(currentRef);
      setIsPaying(false);
      setShowPaystackOverlay(false);
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10 px-4">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <img
          src="/mss-ikeja-logo.png"
          alt="MSSN Ikeja Logo"
          className="w-16 h-16 object-contain"
        />
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-extrabold text-primary tracking-tight">MSSN Ikeja HTC Portal</h1>
          <span className="text-[10px] font-bold text-on-surface-variant tracking-wider uppercase mt-0.5">
            "La ilaha illallah Muhammadur-Rasuulul Allah"
          </span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-xl max-w-2xl w-full p-6 md:p-8">
        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto py-2 custom-scrollbar">
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s
                      ? "bg-primary text-white ring-4 ring-accent/20"
                      : step > s
                      ? "bg-accent text-white"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                <span
                  className={`text-xs font-bold whitespace-nowrap ${
                    step === s ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {s === 1 && "Bio-data"}
                  {s === 2 && "Academic"}
                  {s === 3 && "Health"}
                  {s === 4 && "Payment"}
                </span>
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 min-w-[30px] mx-2 ${
                    step > s ? "bg-accent" : "bg-outline-variant"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Steps container */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-bold text-primary">Personal Details</h3>
              <p className="text-xs text-on-surface-variant">Provide your basic contact information.</p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Full Name (First & Last Name)</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Abdullah Danjuma"
                  className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                    errors.fullName ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                  } focus:outline-none focus:ring-4 transition-all text-sm`}
                />
                {errors.fullName && (
                  <p className="text-xs text-error font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. abdullah@example.com"
                  className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                    errors.email ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                  } focus:outline-none focus:ring-4 transition-all text-sm`}
                />
                {errors.email && (
                  <p className="text-xs text-error font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                    errors.phone ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                  } focus:outline-none focus:ring-4 transition-all text-sm`}
                />
                {errors.phone && (
                  <p className="text-xs text-error font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-on-surface-variant">Gender</label>
                <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant w-full max-w-[240px]">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gender: "Male" }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      formData.gender === "Male"
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, gender: "Female" }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                      formData.gender === "Female"
                        ? "bg-primary text-white shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-bold text-primary">Academic & Professional Details</h3>
              <p className="text-xs text-on-surface-variant">Select your category and provide details.</p>

              {/* Category selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { key: "Secondary School", label: "Secondary School", component: GraduationCap, desc: "For secondary school students" },
                  { key: "Undergraduate/Leaver", label: "Undergraduate / Leaver", component: BookOpen, desc: "For higher institution or graduates" },
                  { key: "Others", label: "Others", component: Briefcase, desc: "For working professionals" },
                ].map((cat) => {
                  const Icon = cat.component;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          category: cat.key as any,
                          school: "",
                          secondaryDistrict: "District 1",
                          secondaryClass: "JSS 1",
                          courseOfStudy: "",
                          yearOfStudy: "Prospective Candidate",
                          jobTitle: "",
                          employmentMode: "Full-Time",
                        }));
                        setErrors({});
                      }}
                      className={`p-5 rounded-2xl border text-left flex flex-col gap-3 transition-all ${
                        formData.category === cat.key
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-outline-variant bg-surface-container-lowest hover:bg-surface-container/30"
                      }`}
                    >
                      <Icon className={`w-8 h-8 ${
                        formData.category === cat.key ? "text-primary" : "text-on-surface-variant"
                      }`} />
                      <div>
                        <p className="font-bold text-sm">{cat.label}</p>
                        <p className="text-xs text-on-surface-variant mt-1">{cat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic sub-fields */}
              {formData.category === "Secondary School" && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Secondary School Name</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="e.g. Al-Hikmat Nursery & Primary School"
                      className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                        errors.school ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                      } focus:outline-none focus:ring-4 transition-all text-sm`}
                    />
                    {errors.school && (
                      <p className="text-xs text-error font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.school}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <CustomSelect
                        label="District"
                        options={DISTRICT_OPTIONS}
                        value={formData.secondaryDistrict}
                        onChange={(val) => handleDropdownChange("secondaryDistrict", val)}
                      />
                      {errors.secondaryDistrict && (
                        <p className="text-xs text-error font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.secondaryDistrict}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <CustomSelect
                        label="Class"
                        options={CLASS_OPTIONS}
                        value={formData.secondaryClass}
                        onChange={(val) => handleDropdownChange("secondaryClass", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.category === "Undergraduate/Leaver" && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">University / Institution Name</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="e.g. University of Lagos"
                      className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                        errors.school ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                      } focus:outline-none focus:ring-4 transition-all text-sm`}
                    />
                    {errors.school && (
                      <p className="text-xs text-error font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.school}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant">Course of Study</label>
                      <input
                        type="text"
                        name="courseOfStudy"
                        value={formData.courseOfStudy}
                        onChange={handleChange}
                        placeholder="e.g. Computer Science"
                        className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                          errors.courseOfStudy ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                        } focus:outline-none focus:ring-4 transition-all text-sm`}
                      />
                      {errors.courseOfStudy && (
                        <p className="text-xs text-error font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.courseOfStudy}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <CustomSelect
                        label="Year of Study"
                        options={YEAR_OPTIONS}
                        value={formData.yearOfStudy}
                        onChange={(val) => handleDropdownChange("yearOfStudy", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.category === "Others" && (
                <div className="flex flex-col gap-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant">Job Title</label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Marketing Manager"
                        className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                          errors.jobTitle ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                        } focus:outline-none focus:ring-4 transition-all text-sm`}
                      />
                      {errors.jobTitle && (
                        <p className="text-xs text-error font-medium flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.jobTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <CustomSelect
                        label="Mode of Employment"
                        options={EMPLOYMENT_OPTIONS}
                        value={formData.employmentMode}
                        onChange={(val) => handleDropdownChange("employmentMode", val)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Company Name</label>
                    <input
                      type="text"
                      name="school"
                      value={formData.school}
                      onChange={handleChange}
                      placeholder="e.g. Sterling Bank Plc"
                      className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                        errors.school ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                      } focus:outline-none focus:ring-4 transition-all text-sm`}
                    />
                    {errors.school && (
                      <p className="text-xs text-error font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.school}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-primary">Health & Safety Information</h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  To ensure your well-being during the encampment, please provide accurate medical information. This data is handled with strict confidentiality by our medical team.
                </p>
              </div>

              {/* Known Allergies section */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-on-surface">Known Allergies</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors select-none ${
                    formData.nutAllergy ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-outline-variant"
                  }`}>
                    <input
                      type="checkbox"
                      name="nutAllergy"
                      checked={formData.nutAllergy}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Nut Allergy</span>
                      <span className="text-[10px] text-on-surface-variant">Peanuts, tree nuts, etc.</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors select-none ${
                    formData.lactoseIntolerance ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-outline-variant"
                  }`}>
                    <input
                      type="checkbox"
                      name="lactoseIntolerance"
                      checked={formData.lactoseIntolerance}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Lactose Intolerance</span>
                      <span className="text-[10px] text-on-surface-variant">Dairy and milk products</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-surface-container-low transition-colors select-none ${
                    formData.medicationAllergy ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-outline-variant"
                  }`}>
                    <input
                      type="checkbox"
                      name="medicationAllergy"
                      checked={formData.medicationAllergy}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">Medication</span>
                      <span className="text-[10px] text-on-surface-variant">Penicillin, aspirin, etc.</span>
                    </div>
                  </label>
                </div>

                <input
                  type="text"
                  name="otherAllergies"
                  value={formData.otherAllergies}
                  onChange={handleChange}
                  placeholder="Other allergies (please specify...)"
                  className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-accent/20 focus:outline-none focus:ring-4 transition-all text-sm mt-1"
                />
              </div>

              {/* Chronic conditions section */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">Chronic Conditions</label>
                <p className="text-[11px] text-on-surface-variant">
                  Please list any ongoing medical conditions (e.g., Asthma, Diabetes, Hypertension) and specify if you carry medication for them.
                </p>
                <textarea
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  placeholder="Example: Asthmatic, carries Ventolin inhaler. Requires regular monitoring of blood glucose..."
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-accent/20 focus:outline-none focus:ring-4 transition-all text-sm resize-none mt-1"
                />
              </div>

              {/* Blood group and genotype */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect
                  label="Blood Group"
                  options={BLOOD_GROUP_OPTIONS}
                  value={formData.bloodGroup}
                  onChange={(val) => handleDropdownChange("bloodGroup", val)}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant">Genotype</label>
                  <input
                    type="text"
                    name="genotype"
                    value={formData.genotype}
                    onChange={handleChange}
                    placeholder="e.g., AA, AS, AC, SS"
                    className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:border-primary focus:ring-accent/20 focus:outline-none focus:ring-4 transition-all text-sm"
                  />
                </div>
              </div>

              <hr className="border-outline-variant my-2" />

              {/* Emergency contact info */}
              <div>
                <h4 className="text-sm font-bold text-primary mb-3">Emergency Contact Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Emergency Contact Person</label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleChange}
                      placeholder="e.g. Father, Mother, or Brother's name"
                      className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                        errors.emergencyContactName ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                      } focus:outline-none focus:ring-4 transition-all text-sm`}
                    />
                    {errors.emergencyContactName && (
                      <p className="text-xs text-error font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.emergencyContactName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-on-surface-variant">Emergency Contact Phone Number</label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleChange}
                      placeholder="e.g. 08087654321"
                      className={`w-full px-4 py-3 bg-surface-container rounded-lg border ${
                        errors.emergencyContactPhone ? "border-error focus:ring-error/20" : "border-outline-variant focus:border-primary focus:ring-accent/20"
                      } focus:outline-none focus:ring-4 transition-all text-sm`}
                    />
                    {errors.emergencyContactPhone && (
                      <p className="text-xs text-error font-medium flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {errors.emergencyContactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Data Privacy Notice Banner */}
              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mt-2">
                <Lock className="text-primary w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-primary">Data Privacy Notice</h5>
                  <p className="text-[10px] text-on-surface-variant leading-relaxed mt-0.5">
                    Your health data is encrypted and accessible only by authorized MSSN Ikeja HTC medical personnel. We collect this to provide emergency care and will delete it 30 days after the encampment ends.
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-lg font-bold text-primary">Camp Registration Fee</h3>
              <p className="text-xs text-on-surface-variant">Review registration fees and proceed to make secure payment.</p>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-on-surface-variant">HTC July Session Camp Fee</span>
                  <span className="text-2xl font-extrabold text-primary">₦{currentFee.toLocaleString()}</span>
                </div>
                <hr className="border-primary/10" />
                <div className="flex gap-2.5 items-start">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                  <p className="text-xs text-on-surface-variant">Includes daily program access, lunch, lecture study materials, practical workshops, and access to all skills classes.</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 border border-outline-variant p-4 rounded-xl">
                <p className="text-xs font-bold">Registration Summary</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className="text-on-surface-variant">Name:</span>
                  <span className="font-semibold text-right">{formData.fullName}</span>
                  <span className="text-on-surface-variant">Gender:</span>
                  <span className="font-semibold text-right">{formData.gender}</span>
                  <span className="text-on-surface-variant">Category:</span>
                  <span className="font-semibold text-right">{formData.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Actions */}
          <div className="flex justify-between mt-8 pt-4 border-t border-outline-variant">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-3 border border-outline text-on-surface-variant text-sm font-bold rounded-lg hover:bg-surface-container/50 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="px-5 py-3 border border-outline text-on-surface-variant text-sm font-bold rounded-lg hover:bg-surface-container/50 transition-all flex items-center gap-2"
              >
                Cancel
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/95 transition-all flex items-center gap-2 shadow-md"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitRegistration}
                className="px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/95 transition-all flex items-center gap-2 shadow-md hover:scale-105"
              >
                Proceed to Payment
                <CreditCard className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Paystack Simulation Overlay */}
      {showPaystackOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-extrabold text-lg tracking-wider">paystack</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded">SIMULATOR</span>
              </div>
              <button
                onClick={() => {
                  if (!isPaying) setShowPaystackOverlay(false);
                }}
                className="text-slate-400 hover:text-white"
                disabled={isPaying}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Paying To</p>
                  <p className="text-sm font-bold text-slate-800">MSSN Ikeja Area Council</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Amount</p>
                  <p className="text-base font-extrabold text-slate-800">₦{currentFee.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Card Number</label>
                  <input
                    type="text"
                    disabled
                    value="4000 1234 5678 9010"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Expiry Date</label>
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono text-sm focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">CVV</label>
                    <input
                      type="password"
                      disabled
                      value="123"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 font-mono text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {isPaying ? (
                <div className="py-4 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-500 font-bold">Authorizing transaction on Paystack network...</p>
                </div>
              ) : (
                <button
                  onClick={simulateSuccessPayment}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:shadow-emerald-500/10 transition-all text-sm flex items-center justify-center gap-2"
                >
                  Confirm & Pay ₦{currentFee.toLocaleString()}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
