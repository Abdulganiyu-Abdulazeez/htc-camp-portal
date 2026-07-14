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
  assignedGroup: string; // e.g. "Abu Bakr", "Aisha", "Khadijah", "Umar", "None"
  assignedRoom: string;  // e.g. "Room 4", "None"
  createdAt: string;
}

export interface CampSettings {
  campFee: number;
  capacityLimit: number;
  startDate: string;
  endDate: string;
  autoGroupingEnabled: boolean;
}

interface AppStateContextType {
  delegates: Delegate[];
  settings: CampSettings;
  currentDelegate: Delegate | null;
  isAdminLoggedIn: boolean;
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
  }
];

const INITIAL_SETTINGS: CampSettings = {
  campFee: 8500,
  capacityLimit: 500,
  startDate: "2026-07-25",
  endDate: "2026-07-27",
  autoGroupingEnabled: true,
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [delegates, setDelegates] = useState<Delegate[]>(INITIAL_DELEGATES);
  const [settings, setSettings] = useState<CampSettings>(INITIAL_SETTINGS);
  const [currentDelegate, setCurrentDelegate] = useState<Delegate | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

    const storedAdminLoggedIn = sessionStorage.getItem("htc_admin_logged_in");
    if (storedAdminLoggedIn) {
      setIsAdminLoggedIn(storedAdminLoggedIn === "true");
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
            setSettings(settingsData);
          }

          // Fetch delegates
          const { data: delegatesData, error: delegatesError } = await supabase
            .from("delegates")
            .select("*")
            .order("createdAt", { ascending: false });

          if (!delegatesError && delegatesData) {
            setDelegates(delegatesData);
          }
        } catch (err) {
          console.error("Failed to sync from Supabase on mount:", err);
        }
      };
      syncData();
    }
  }, []);

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
            if (d.gender === "Male") {
              assignedGroup = d.category === "Secondary School" ? "Umar" : "Abu Bakr";
              assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
            } else {
              assignedGroup = d.category === "Secondary School" ? "Khadijah" : "Aisha";
              assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
            }
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
      const updated = prev.map((d) => {
        if (d.paymentStatus === "verified" && d.assignedGroup === "None") {
          let assignedGroup = "None";
          let assignedRoom = "None";
          
          if (d.gender === "Male") {
            assignedGroup = d.category === "Secondary School" ? "Umar" : "Abu Bakr";
            assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
          } else {
            assignedGroup = d.category === "Secondary School" ? "Khadijah" : "Aisha";
            assignedRoom = `Room ${Math.floor(Math.random() * 5) + 1}`;
          }

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
    const validEmail = email.trim().toLowerCase() === "admin@ikeja-area.org" || email.trim().toLowerCase() === "admin@example.com";
    const validPassword = password === "admin123" || password === "htc2026";
    if (validEmail && validPassword) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
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
      supabase
        .from("settings")
        .update(newSettings)
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
