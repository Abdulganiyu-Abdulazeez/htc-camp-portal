"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, hasSupabase } from "@/lib/supabase";

export interface Delegate {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  gender: "Male" | "Female";
  category: "Secondary School" | "Undergraduate/Leaver" | "Others";
  school: string; // Secondary School Name, University Name, or Company Name
  secondaryDistrict?: string;
  secondaryClass?: string; // Dropdown value
  courseOfStudy?: string;
  yearOfStudy?: string; // Dropdown value: Prospective Candidate, 100 to 600
  jobTitle?: string;
  employmentMode?: string; // Dropdown value: Full-Time, Part-Time, Freelance, Self-Employed, Unemployed
  medicalCondition: string; // General compiled description
  nutAllergy?: boolean;
  lactoseIntolerance?: boolean;
  medicationAllergy?: boolean;
  otherAllergies?: string;
  chronicConditions?: string;
  bloodGroup?: string;
  genotype?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  paymentStatus: "verified" | "pending";
  assignedGroup: string; // e.g. "Abu Bakr", "Umar", "Uthman", "Ali", "Aisha", "Khadijah", "Fatimah", "Zaynab", "None"
  assignedRoom: string;  // e.g. "Room 4", "None"
  createdAt: string;
  skillOfInterest: string;
}

export interface CampSettings {
  campFeeSecondary: number;
  campFeeUndergrad: number;
  capacityLimit: number;
  startDate: string;
  endDate: string;
  autoGroupingEnabled: boolean;
}

export interface Administrator {
  id: string;
  fullName: string;
  email: string;
  role: "Super Admin" | "Registry";
  status: "Active" | "Pending";
  lastLogin?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: "Logistics" | "Curriculum" | "Emergency" | "Spiritual";
  content: string;
  expiryDate?: string;
  status: "Published" | "Draft";
  createdAt: string;
  attachments?: { name: string; url: string; type: "image" | "document" }[];
}

export interface PaystackTransaction {
  id: string;
  reference: string;
  delegateName: string;
  delegateEmail: string;
  amount: number;
  status: "success" | "failed";
  channel: string;
  errorMessage?: string;
  createdAt: string;
}

interface AppStateContextType {
  delegates: Delegate[];
  settings: CampSettings;
  currentDelegate: Delegate | null;
  isAdminLoggedIn: boolean;
  currentAdmin: Administrator | null;
  administrators: Administrator[];
  announcements: Announcement[];
  transactions: PaystackTransaction[];
  registerDelegate: (data: Omit<Delegate, "id" | "reference" | "paymentStatus" | "assignedGroup" | "assignedRoom" | "createdAt">) => Delegate;
  confirmPayment: (reference: string) => void;
  overridePayment: (reference: string) => void;
  assignGroup: (delegateId: string, groupName: string, roomName: string) => void;
  autoGroupDelegates: () => void;
  sendBulkEmail: (subject: string, body: string, recipientIds: string[], onProgress: (progress: number) => void) => Promise<void>;
  loginAsAdmin: (email: string, password: string) => boolean;
  logoutAdmin: () => void;
  loginAsDelegate: (identifier: string) => boolean; // identifier can be email or reference
  logoutDelegate: () => void;
  updateSettings: (newSettings: Partial<CampSettings>) => void;
  addAdministrator: (fullName: string, email: string, role: "Super Admin" | "Registry") => Promise<void>;
  deleteAdministrator: (id: string) => Promise<void>;
  updateAdminRole: (id: string, role: "Super Admin" | "Registry") => Promise<void>;
  publishAnnouncement: (title: string, category: Announcement["category"], content: string, expiryDate?: string, attachments?: Announcement["attachments"]) => Promise<void>;
  saveAnnouncementDraft: (title: string, category: Announcement["category"], content: string, expiryDate?: string, attachments?: Announcement["attachments"]) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  recordFailedTransaction: (ref: string, amount: number, errorMsg: string, delegateName: string, delegateEmail: string) => void;
}

const INITIAL_DELEGATES: Delegate[] = [
  {
    id: "HTC-2026-0482",
    reference: "REF-1720894562",
    fullName: "Abdullah Danjuma",
    email: "abdullah@example.com",
    phone: "08012345678",
    gender: "Male",
    category: "Undergraduate/Leaver",
    school: "University of Lagos",
    courseOfStudy: "Computer Engineering",
    yearOfStudy: "400 Level",
    medicalCondition: "Asthma",
    chronicConditions: "Asthmatic, carries Ventolin inhaler.",
    bloodGroup: "O+",
    genotype: "AA",
    emergencyContactName: "Ibrahim Danjuma",
    emergencyContactPhone: "08087654321",
    paymentStatus: "verified",
    assignedGroup: "Abu Bakr",
    assignedRoom: "Room 4",
    createdAt: "2026-07-08T10:00:00Z",
    skillOfInterest: "Videography/Video editing",
  },
  {
    id: "HTC-2026-0123",
    reference: "REF-1720894599",
    fullName: "Aisha Yusuf",
    email: "aisha@example.com",
    phone: "08023456789",
    gender: "Female",
    category: "Undergraduate/Leaver",
    school: "Lagos State University",
    courseOfStudy: "Medicine & Surgery",
    yearOfStudy: "500 Level",
    medicalCondition: "None",
    bloodGroup: "A+",
    genotype: "AA",
    emergencyContactName: "Maryam Yusuf",
    emergencyContactPhone: "08076543210",
    paymentStatus: "verified",
    assignedGroup: "Aisha",
    assignedRoom: "Room 1",
    createdAt: "2026-07-09T11:30:00Z",
    skillOfInterest: "Mobile graphics",
  },
  {
    id: "HTC-2026-0294",
    reference: "REF-1720894611",
    fullName: "Halimah Bello",
    email: "halimah@example.com",
    phone: "08034567890",
    gender: "Female",
    category: "Undergraduate/Leaver",
    school: "Yaba College of Technology",
    courseOfStudy: "Prospective Candidate",
    yearOfStudy: "Prospective Candidate",
    medicalCondition: "None",
    bloodGroup: "B+",
    genotype: "AS",
    emergencyContactName: "Zainab Bello",
    emergencyContactPhone: "08065432109",
    paymentStatus: "verified",
    assignedGroup: "Aisha",
    assignedRoom: "Room 2",
    createdAt: "2026-07-09T14:45:00Z",
    skillOfInterest: "Crocheting",
  },
  {
    id: "pending_1",
    reference: "REF-7298319203",
    fullName: "Umar Farooq",
    email: "umar@example.com",
    phone: "08045678901",
    gender: "Male",
    category: "Secondary School",
    school: "Ikeja Grammar School",
    secondaryDistrict: "District 1",
    secondaryClass: "SSS 2",
    medicalCondition: "None",
    emergencyContactName: "Farooq Usman",
    emergencyContactPhone: "08054321098",
    paymentStatus: "pending",
    assignedGroup: "None",
    assignedRoom: "None",
    createdAt: "2026-07-10T09:15:00Z",
    skillOfInterest: "Ankara crafts",
  },
  {
    id: "HTC-2026-0005",
    reference: "REF-1720894722",
    fullName: "Zubair Alabi",
    email: "zubair@example.com",
    phone: "08056789012",
    gender: "Male",
    category: "Secondary School",
    school: "Ikeja High School",
    secondaryDistrict: "District 2",
    secondaryClass: "SSS 3",
    medicalCondition: "None",
    emergencyContactName: "Luqman Alabi",
    emergencyContactPhone: "08043210987",
    paymentStatus: "verified",
    assignedGroup: "None",
    assignedRoom: "None",
    createdAt: "2026-07-10T16:20:00Z",
    skillOfInterest: "public speaking & creative writing",
  },
  {
    id: "pending_2",
    reference: "REF-8293740192",
    fullName: "Fatimah Shuaib",
    email: "fatimah@example.com",
    phone: "08067890123",
    gender: "Female",
    category: "Secondary School",
    school: "Fadilah College",
    secondaryDistrict: "District 4",
    secondaryClass: "SSS 1",
    medicalCondition: "Nut Allergy",
    nutAllergy: true,
    otherAllergies: "Peanuts",
    emergencyContactName: "Shuaib Ahmed",
    emergencyContactPhone: "08032109876",
    paymentStatus: "pending",
    assignedGroup: "None",
    assignedRoom: "None",
    createdAt: "2026-07-11T08:00:00Z",
    skillOfInterest: "Crocheting",
  },
  {
    id: "HTC-2026-0007",
    reference: "REF-1720894812",
    fullName: "Mustapha Bashir",
    email: "mustapha@example.com",
    phone: "08078901234",
    gender: "Male",
    category: "Others",
    school: "Sterling Bank",
    jobTitle: "Software Engineer",
    employmentMode: "Full-Time",
    medicalCondition: "None",
    emergencyContactName: "Bashir Musa",
    emergencyContactPhone: "08021098765",
    paymentStatus: "verified",
    assignedGroup: "None",
    assignedRoom: "None",
    createdAt: "2026-07-11T10:10:00Z",
    skillOfInterest: "Mobile graphics",
  },
  {
    id: "HTC-2026-0008",
    reference: "REF-1720894888",
    fullName: "Mariam Ibrahim",
    email: "mariam@example.com",
    phone: "08089012345",
    gender: "Female",
    category: "Secondary School",
    school: "Model College Meiran",
    secondaryDistrict: "District 3",
    secondaryClass: "JSS 3",
    medicalCondition: "None",
    emergencyContactName: "Ibrahim Kolawole",
    emergencyContactPhone: "08010987654",
    paymentStatus: "verified",
    assignedGroup: "None",
    assignedRoom: "None",
    createdAt: "2026-07-11T15:30:00Z",
    skillOfInterest: "public speaking & creative writing",
  }
];

const INITIAL_SETTINGS: CampSettings = {
  campFeeSecondary: 4000,
  campFeeUndergrad: 6000,
  capacityLimit: 500,
  startDate: "2026-07-25",
  endDate: "2026-07-27",
  autoGroupingEnabled: true,
};

const INITIAL_ADMINISTRATORS: Administrator[] = [
  {
    id: "admin_2",
    fullName: "Musa Bello",
    email: "musa@example.com",
    role: "Registry",
    status: "Active",
    lastLogin: "2026-07-13T10:00:00Z",
    createdAt: "2026-07-08T03:05:00Z",
  },
  {
    id: "admin_abdulganiyu",
    fullName: "Abdulganiyu Abdulazeez",
    email: "abdulganiyuabdulazeez20@gmail.com",
    role: "Super Admin",
    status: "Active",
    createdAt: "2026-07-14T20:30:00Z",
  },
  {
    id: "admin_fazazi",
    fullName: "Abdulbasit Fazazi",
    email: "fazaziishola@gmail.com",
    role: "Super Admin",
    status: "Active",
    createdAt: "2026-07-14T20:30:00Z",
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_1",
    title: "HTC Registration Deadline Extended",
    category: "Logistics",
    content: "We have extended registration for the HTC July Session until July 20. Please complete your fee payment as early as possible to secure your hostel allocation.",
    status: "Published",
    createdAt: "2026-07-11T09:00:00Z",
  },
  {
    id: "ann_2",
    title: "Pre-camp Briefing Session",
    category: "Curriculum",
    content: "There will be a virtual pre-camp meeting on Zoom for all registered undergraduates and school leavers. The link will be dispatched via email. We will outline the course curriculum and medical guidelines.",
    status: "Published",
    createdAt: "2026-07-08T11:30:00Z",
  }
];

export const getDelegateFee = (
  category: string,
  yearOfStudy?: string,
  campFeeSecondary: number = 4000,
  campFeeUndergrad: number = 6000
) => {
  if (category === "Secondary School") {
    return campFeeSecondary;
  }
  if (category === "Undergraduate/Leaver" && yearOfStudy === "Prospective Candidate") {
    return campFeeSecondary;
  }
  return campFeeUndergrad;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [delegates, setDelegates] = useState<Delegate[]>(INITIAL_DELEGATES);
  const [settings, setSettings] = useState<CampSettings>(INITIAL_SETTINGS);
  const [currentDelegate, setCurrentDelegate] = useState<Delegate | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [currentAdmin, setCurrentAdmin] = useState<Administrator | null>(null);
  const [administrators, setAdministrators] = useState<Administrator[]>(INITIAL_ADMINISTRATORS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [failedTransactions, setFailedTransactions] = useState<PaystackTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Derived transactions (success from verified delegates + failed attempts)
  const transactions: PaystackTransaction[] = React.useMemo(() => {
    const successTransactions = delegates
      .filter((d) => d.paymentStatus === "verified")
      .map((d) => ({
        id: `tx_success_${d.id}`,
        reference: d.reference,
        delegateName: d.fullName,
        delegateEmail: d.email,
        amount: getDelegateFee(d.category, d.yearOfStudy, settings.campFeeSecondary, settings.campFeeUndergrad),
        status: "success" as const,
        channel: "card",
        createdAt: d.createdAt,
      }));

    return [...successTransactions, ...failedTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [delegates, failedTransactions, settings.campFeeSecondary, settings.campFeeUndergrad]);

  // Load initial state from sessionStorage on client side after mount
  useEffect(() => {
    const storedDelegates = sessionStorage.getItem("htc_delegates");
    if (storedDelegates) {
      try {
        setDelegates(JSON.parse(storedDelegates));
      } catch (e) {
        console.error(e);
      }
    }

    const storedSettings = sessionStorage.getItem("htc_settings");
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        if (parsed.startDate === "2026-12-20" || parsed.endDate === "2026-12-27") {
          parsed.startDate = "2026-07-25";
          parsed.endDate = "2026-07-27";
        }
        setSettings(parsed);
      } catch (e) {
        console.error(e);
      }
    }

    const storedCurrentDelegate = sessionStorage.getItem("htc_current_delegate");
    if (storedCurrentDelegate) {
      try {
        setCurrentDelegate(JSON.parse(storedCurrentDelegate));
      } catch (e) {
        console.error(e);
      }
    }

    const storedCurrentAdmin = sessionStorage.getItem("htc_current_admin");
    if (storedCurrentAdmin) {
      try {
        setCurrentAdmin(JSON.parse(storedCurrentAdmin));
      } catch (e) {
        console.error(e);
      }
    }

    const storedAdministrators = sessionStorage.getItem("htc_administrators");
    if (storedAdministrators) {
      try {
        setAdministrators(JSON.parse(storedAdministrators));
      } catch (e) {
        console.error(e);
      }
    }

    const storedAnnouncements = sessionStorage.getItem("htc_announcements");
    if (storedAnnouncements) {
      try {
        setAnnouncements(JSON.parse(storedAnnouncements));
      } catch (e) {
        console.error(e);
      }
    }

    const storedAdminLoggedIn = sessionStorage.getItem("htc_admin_logged_in");
    if (storedAdminLoggedIn) {
      setIsAdminLoggedIn(storedAdminLoggedIn === "true");
    }

    const storedFailedTx = sessionStorage.getItem("htc_failed_transactions");
    if (storedFailedTx) {
      try {
        setFailedTransactions(JSON.parse(storedFailedTx));
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoaded(true);

    // Fetch fresh data from Supabase in the background if configured
    if (hasSupabase) {
      const syncData = async () => {
        try {
          // Fetch settings
          const { data: settingsData, error: settingsError } = await supabase
            .from("settings")
            .select("*")
            .eq("id", 1)
            .single();

          if (!settingsError && settingsData) {
            setSettings({
              campFeeSecondary: settingsData.campFeeSecondary ?? 4000,
              campFeeUndergrad: settingsData.campFeeUndergrad ?? settingsData.campFee ?? 6000,
              capacityLimit: settingsData.capacityLimit,
              startDate: settingsData.startDate,
              endDate: settingsData.endDate,
              autoGroupingEnabled: settingsData.autoGroupingEnabled,
            });
          }

          // Fetch delegates
          const { data: delegatesData, error: delegatesError } = await supabase
            .from("delegates")
            .select("*")
            .order("createdAt", { ascending: false });

          if (!delegatesError && delegatesData) {
            setDelegates(delegatesData);
          }

          // Fetch administrators
          const { data: adminsData, error: adminsError } = await supabase
            .from("administrators")
            .select("*")
            .order("createdAt", { ascending: true });

          if (!adminsError && adminsData) {
            let updatedAdmins = [...adminsData];
            const abdulEmail = "abdulganiyuabdulazeez20@gmail.com";
            const fazaziEmail = "fazaziishola@gmail.com";
            
            const hasAbdul = adminsData.some((a) => a.email.toLowerCase() === abdulEmail);
            const hasFazazi = adminsData.some((a) => a.email.toLowerCase() === fazaziEmail);

            if (!hasAbdul) {
              const abdulAdmin: Administrator = {
                id: "admin_abdulganiyu",
                fullName: "Abdulganiyu Abdulazeez",
                email: abdulEmail,
                role: "Super Admin",
                status: "Active",
                createdAt: new Date().toISOString(),
              };
              updatedAdmins.push(abdulAdmin);
              supabase.from("administrators").insert([abdulAdmin]).then(({ error }) => {
                if (error) console.error("Failed to auto-seed Abdulganiyu to Supabase:", error);
              });
            }

            if (!hasFazazi) {
              const fazaziAdmin: Administrator = {
                id: "admin_fazazi",
                fullName: "Abdulbasit Fazazi",
                email: fazaziEmail,
                role: "Super Admin",
                status: "Active",
                createdAt: new Date().toISOString(),
              };
              updatedAdmins.push(fazaziAdmin);
              supabase.from("administrators").insert([fazaziAdmin]).then(({ error }) => {
                if (error) console.error("Failed to auto-seed Fazazi to Supabase:", error);
              });
            }

            setAdministrators(updatedAdmins);
          }

          // Fetch announcements
          const { data: announcementsData, error: announcementsError } = await supabase
            .from("announcements")
            .select("*")
            .order("createdAt", { ascending: false });

          if (!announcementsError && announcementsData) {
            setAnnouncements(announcementsData);
          }
        } catch (err) {
          console.error("Failed to sync from Supabase on mount:", err);
        }
      };
      syncData();
    }
  }, []);

  // Keep currentDelegate in sync with the delegates list (e.g. when payment status or room changes)
  useEffect(() => {
    if (currentDelegate) {
      const fresh = delegates.find(
        (d) =>
          d.email.toLowerCase() === currentDelegate.email.toLowerCase() ||
          d.reference === currentDelegate.reference
      );
      if (fresh && JSON.stringify(fresh) !== JSON.stringify(currentDelegate)) {
        setCurrentDelegate(fresh);
      }
    }
  }, [delegates, currentDelegate]);

  // Save to sessionStorage only after the client-side state has been initialized/loaded
  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_delegates", JSON.stringify(delegates));
  }, [delegates, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_settings", JSON.stringify(settings));
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentDelegate) {
      sessionStorage.setItem("htc_current_delegate", JSON.stringify(currentDelegate));
    } else {
      sessionStorage.removeItem("htc_current_delegate");
    }
  }, [currentDelegate, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_admin_logged_in", String(isAdminLoggedIn));
  }, [isAdminLoggedIn, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (currentAdmin) {
      sessionStorage.setItem("htc_current_admin", JSON.stringify(currentAdmin));
    } else {
      sessionStorage.removeItem("htc_current_admin");
    }
  }, [currentAdmin, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_administrators", JSON.stringify(administrators));
  }, [administrators, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_announcements", JSON.stringify(announcements));
  }, [announcements, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    sessionStorage.setItem("htc_failed_transactions", JSON.stringify(failedTransactions));
  }, [failedTransactions, isLoaded]);

  const registerDelegate = (data: Omit<Delegate, "id" | "reference" | "paymentStatus" | "assignedGroup" | "assignedRoom" | "createdAt">) => {
    const timestamp = Date.now();
    const ref = `REF-${timestamp}`;
    const newDelegate: Delegate = {
      ...data,
      id: `pending_${timestamp}`,
      reference: ref,
      paymentStatus: "pending",
      assignedGroup: "None",
      assignedRoom: "None",
      createdAt: new Date().toISOString(),
    };

    // Update local state (optimistic UI & sessionStorage update)
    setDelegates((prev) => [newDelegate, ...prev]);

    // Async write to Supabase
    if (hasSupabase) {
      supabase
        .from("delegates")
        .insert([newDelegate])
        .then(({ error }) => {
          if (error) {
            console.error("Failed to sync registered delegate to Supabase:", error);
          } else {
            console.log("Successfully synced registered delegate to Supabase.");
          }
        });
    }

    return newDelegate;
  };

  const confirmPayment = (reference: string) => {
    let updatedDelegate: Delegate | null = null;

    setDelegates((prev) =>
      prev.map((d) => {
        if (d.reference === reference && d.paymentStatus === "pending") {
          const nextHtcNumber = prev.filter(x => x.id.startsWith("HTC-")).length + 1;
          const formattedNumber = String(nextHtcNumber).padStart(4, "0");
          const newId = `HTC-2026-${formattedNumber}`;
          
          let assignedGroup = "None";
          let assignedRoom = "None";

          // If auto-grouping is enabled, allocate
          if (settings.autoGroupingEnabled) {
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
            prev.forEach(x => {
              if (x.assignedGroup && x.assignedGroup !== "None" && allHouses.includes(x.assignedGroup)) {
                groupCounts[x.assignedGroup]++;
                const cat = x.category || "Others";
                if (!categoryGroupCounts[x.assignedGroup][cat]) {
                  categoryGroupCounts[x.assignedGroup][cat] = 0;
                }
                categoryGroupCounts[x.assignedGroup][cat]++;
              }
            });

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
            assignedGroup = bestGroup;
          }

          const updated = {
            ...d,
            id: newId,
            paymentStatus: "verified" as const,
            assignedGroup,
            assignedRoom,
          };

          updatedDelegate = updated;
          
          if (currentDelegate && currentDelegate.reference === reference) {
            setCurrentDelegate(updated);
          }
          return updated;
        }
        return d;
      })
    );

    // Async write to Supabase
    if (hasSupabase && updatedDelegate) {
      const { id, paymentStatus, assignedGroup, assignedRoom } = updatedDelegate;
      supabase
        .from("delegates")
        .update({
          id,
          paymentStatus,
          assignedGroup,
          assignedRoom
        })
        .eq("reference", reference)
        .then(({ error }) => {
          if (error) {
            console.error(`Failed to sync payment confirmation to Supabase for reference ${reference}:`, error);
          } else {
            console.log(`Successfully synced payment confirmation to Supabase for reference ${reference}.`);
          }
        });
    }

    // Trigger confirmation email dispatch via Next.js API route
    if (updatedDelegate) {
      const delegate: Delegate = updatedDelegate;
      const fee = getDelegateFee(delegate.category, delegate.yearOfStudy, settings.campFeeSecondary, settings.campFeeUndergrad);
      fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: delegate.email,
          name: delegate.fullName,
          reference: delegate.reference,
          amount: fee,
          category: delegate.category,
          group: delegate.assignedGroup,
        }),
      })
        .then(async (res) => {
          if (res.ok) {
            console.log(`Successfully sent registration confirmation email to ${delegate.email}`);
          } else {
            const err = await res.json();
            console.error("Resend API email dispatch failed:", err);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch send-email API:", err);
        });
    }
  };

  const overridePayment = (reference: string) => {
    confirmPayment(reference);
  };

  const assignGroup = (delegateId: string, groupName: string, roomName: string) => {
    let updatedDelegate: Delegate | null = null;

    setDelegates((prev) =>
      prev.map((d) => {
        if (d.id === delegateId) {
          const updated = {
            ...d,
            assignedGroup: groupName,
            assignedRoom: roomName,
          };
          updatedDelegate = updated;
          if (currentDelegate && currentDelegate.id === delegateId) {
            setCurrentDelegate(updated);
          }
          return updated;
        }
        return d;
      })
    );

    // Async write to Supabase
    if (hasSupabase && updatedDelegate) {
      supabase
        .from("delegates")
        .update({
          assignedGroup: groupName,
          assignedRoom: roomName
        })
        .eq("id", delegateId)
        .then(({ error }) => {
          if (error) {
            console.error(`Failed to sync group assignment to Supabase for delegate ${delegateId}:`, error);
          } else {
            console.log(`Successfully synced group assignment to Supabase for delegate ${delegateId}.`);
          }
        });
    }
  };

  const autoGroupDelegates = () => {
    const updatedDelegatesList: Delegate[] = [];

    setDelegates((prev) => {
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
      prev.forEach(x => {
        if (x.assignedGroup && x.assignedGroup !== "None" && allHouses.includes(x.assignedGroup)) {
          groupCounts[x.assignedGroup]++;
          const cat = x.category || "Others";
          if (!categoryGroupCounts[x.assignedGroup][cat]) {
            categoryGroupCounts[x.assignedGroup][cat] = 0;
          }
          categoryGroupCounts[x.assignedGroup][cat]++;
        }
      });

      const updated = prev.map((d) => {
        if (d.paymentStatus === "verified" && d.assignedGroup === "None") {
          let assignedGroup = "None";
          let assignedRoom = "None";
          
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
          assignedGroup = bestGroup;

          const cat = d.category || "Others";
          groupCounts[assignedGroup]++;
          categoryGroupCounts[assignedGroup][cat]++;

          const updatedDel = {
            ...d,
            assignedGroup,
            assignedRoom,
          };
          updatedDelegatesList.push(updatedDel);
          return updatedDel;
        }
        return d;
      });

      // Update current delegate if their assignment changed
      if (currentDelegate && currentDelegate.paymentStatus === "verified" && currentDelegate.assignedGroup === "None") {
        const found = updated.find(x => x.id === currentDelegate.id);
        if (found) {
          setCurrentDelegate(found);
        }
      }

      return updated;
    });

    // Async write to Supabase
    if (hasSupabase && updatedDelegatesList.length > 0) {
      const updates = updatedDelegatesList.map((d) =>
        supabase
          .from("delegates")
          .update({
            assignedGroup: d.assignedGroup,
            assignedRoom: d.assignedRoom
          })
          .eq("id", d.id)
      );

      Promise.all(updates).then((results) => {
        const errors = results.filter((r) => r.error);
        if (errors.length > 0) {
          console.error("Some automatic group assignments failed to sync to Supabase:", errors);
        } else {
          console.log("All automatic group assignments synced to Supabase successfully.");
        }
      });
    }
  };

  const sendBulkEmail = (
    subject: string,
    body: string,
    recipientIds: string[],
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve) => {
      let count = 0;
      const total = recipientIds.length;
      if (total === 0) {
        onProgress(100);
        resolve();
        return;
      }

      const interval = setInterval(() => {
        count++;
        const percent = Math.floor((count / total) * 100);
        onProgress(percent);
        if (count >= total) {
          clearInterval(interval);
          resolve();
        }
      }, 100); // 100ms per email simulation
    });
  };

  const loginAsAdmin = (email: string, password: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const validPassword = password === "HtcAdminPortal'26";

    if (!validPassword) return false;

    // Check specific custom admin accounts requested by the user
    if (trimmedEmail === "abdulganiyuabdulazeez20@gmail.com" || trimmedEmail === "fazaziishola@gmail.com") {
      const isAbdul = trimmedEmail === "abdulganiyuabdulazeez20@gmail.com";
      const fullName = isAbdul ? "Abdulganiyu Abdulazeez" : "Abdulbasit Fazazi";
      const adminId = isAbdul ? "admin_abdulganiyu" : "admin_fazazi";
      
      const admin: Administrator = {
        id: adminId,
        fullName: fullName,
        email: trimmedEmail,
        role: "Super Admin",
        status: "Active",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      setCurrentAdmin(admin);
      setIsAdminLoggedIn(true);

      const exists = administrators.some((a) => a.email.toLowerCase() === trimmedEmail);
      if (!exists) {
        setAdministrators((prev) => [...prev, admin]);
        if (hasSupabase) {
          supabase
            .from("administrators")
            .insert([admin])
            .then(({ error }) => {
              if (error) console.error("Failed to insert custom admin to Supabase:", error);
            });
        }
      } else {
        setAdministrators((prev) =>
          prev.map((a) => (a.email.toLowerCase() === trimmedEmail ? { ...a, lastLogin: admin.lastLogin } : a))
        );
        if (hasSupabase) {
          supabase
            .from("administrators")
            .update({ lastLogin: admin.lastLogin })
            .eq("email", trimmedEmail)
            .then(({ error }) => {
              if (error) console.error("Failed to update last login in Supabase:", error);
            });
        }
      }
      return true;
    }



    // Check registered administrators list
    const matchedAdmin = administrators.find(
      (a) => a.email.toLowerCase() === trimmedEmail && a.status === "Active"
    );
    if (matchedAdmin) {
      setCurrentAdmin(matchedAdmin);
      setIsAdminLoggedIn(true);
      return true;
    }

    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setCurrentAdmin(null);
  };

  const addAdministrator = async (fullName: string, email: string, role: "Super Admin" | "Registry") => {
    const newAdmin: Administrator = {
      id: `admin_${Date.now()}`,
      fullName,
      email,
      role,
      status: "Pending", // invites default to Pending status
      createdAt: new Date().toISOString(),
    };

    setAdministrators((prev) => [...prev, newAdmin]);

    if (hasSupabase) {
      const { error } = await supabase.from("administrators").insert(newAdmin);
      if (error) {
        console.error("Failed to insert administrator to Supabase:", error);
      }
    }
  };

  const deleteAdministrator = async (id: string) => {
    setAdministrators((prev) => prev.filter((a) => a.id !== id));

    if (hasSupabase) {
      const { error } = await supabase.from("administrators").delete().eq("id", id);
      if (error) {
        console.error("Failed to delete administrator from Supabase:", error);
      }
    }
  };

  const updateAdminRole = async (id: string, role: "Super Admin" | "Registry") => {
    setAdministrators((prev) =>
      prev.map((a) => (a.id === id ? { ...a, role } : a))
    );
    if (currentAdmin && currentAdmin.id === id) {
      setCurrentAdmin((prev) => (prev ? { ...prev, role } : null));
    }
    if (hasSupabase) {
      const { error } = await supabase.from("administrators").update({ role }).eq("id", id);
      if (error) {
        console.error("Failed to update administrator role in Supabase:", error);
      }
    }
  };

  const recordFailedTransaction = (
    ref: string,
    amount: number,
    errorMsg: string,
    delegateName: string,
    delegateEmail: string
  ) => {
    const newTx: PaystackTransaction = {
      id: `tx_failed_${Date.now()}`,
      reference: ref,
      delegateName,
      delegateEmail,
      amount,
      status: "failed" as const,
      channel: "card",
      errorMessage: errorMsg,
      createdAt: new Date().toISOString(),
    };
    setFailedTransactions((prev) => [newTx, ...prev]);
  };

  const publishAnnouncement = async (
    title: string,
    category: Announcement["category"],
    content: string,
    expiryDate?: string,
    attachments?: Announcement["attachments"]
  ) => {
    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      category,
      content,
      expiryDate,
      status: "Published",
      createdAt: new Date().toISOString(),
      attachments: attachments || [],
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    if (hasSupabase) {
      const { error } = await supabase.from("announcements").insert(newAnnouncement);
      if (error) {
        console.error("Failed to publish announcement to Supabase:", error);
      }
    }
  };

  const saveAnnouncementDraft = async (
    title: string,
    category: Announcement["category"],
    content: string,
    expiryDate?: string,
    attachments?: Announcement["attachments"]
  ) => {
    const newAnnouncement: Announcement = {
      id: `ann_${Date.now()}`,
      title,
      category,
      content,
      expiryDate,
      status: "Draft",
      createdAt: new Date().toISOString(),
      attachments: attachments || [],
    };

    setAnnouncements((prev) => [newAnnouncement, ...prev]);

    if (hasSupabase) {
      const { error } = await supabase.from("announcements").insert(newAnnouncement);
      if (error) {
        console.error("Failed to save draft announcement to Supabase:", error);
      }
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));

    if (hasSupabase) {
      const { error } = await supabase.from("announcements").delete().eq("id", id);
      if (error) {
        console.error("Failed to delete announcement from Supabase:", error);
      }
    }
  };

  const loginAsDelegate = (identifier: string) => {
    const delegate = delegates.find(
      (d) =>
        d.email.toLowerCase() === identifier.trim().toLowerCase() ||
        d.reference === identifier.trim() ||
        d.id === identifier.trim()
    );
    if (delegate) {
      setCurrentDelegate(delegate);
      return true;
    }
    return false;
  };

  const logoutDelegate = () => {
    setCurrentDelegate(null);
  };

  const updateSettings = (newSettings: Partial<CampSettings>) => {
    let finalSettings: CampSettings | null = null;
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      finalSettings = updated;
      return updated;
    });

    if (hasSupabase && finalSettings) {
      const updateData = {
        ...newSettings,
        ...(newSettings.campFeeUndergrad !== undefined ? { campFee: newSettings.campFeeUndergrad } : {}),
      };
      supabase
        .from("settings")
        .update(updateData)
        .eq("id", 1)
        .then(({ error }) => {
          if (error) {
            console.error("Failed to sync settings updates to Supabase:", error);
          } else {
            console.log("Successfully synced settings updates to Supabase.");
          }
        });
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        delegates,
        settings,
        currentDelegate,
        isAdminLoggedIn,
        currentAdmin,
        administrators,
        announcements,
        transactions,
        registerDelegate,
        confirmPayment,
        overridePayment,
        assignGroup,
        autoGroupDelegates,
        sendBulkEmail,
        loginAsAdmin,
        logoutAdmin,
        loginAsDelegate,
        logoutDelegate,
        updateSettings,
        addAdministrator,
        deleteAdministrator,
        updateAdminRole,
        publishAnnouncement,
        saveAnnouncementDraft,
        deleteAnnouncement,
        recordFailedTransaction,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
