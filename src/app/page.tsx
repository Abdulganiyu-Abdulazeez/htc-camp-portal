"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/app-state";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Armchair,
  Building,
  Bus,
  Map,
  X,
  AlertCircle,
  LogIn
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { delegates, loginAsDelegate, settings } = useAppState();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg("Please enter your email or reference ID.");
      return;
    }
    const success = loginAsDelegate(identifier);
    if (success) {
      router.push("/dashboard");
    } else {
      setErrorMsg("No registration found with this email or reference ID.");
    }
  };

  // Calculate live stats
  const totalVerified = delegates.filter((d) => d.paymentStatus === "verified").length;
  const totalDelegates = delegates.length;
  const capacityLeft = settings.capacityLimit - totalVerified;

  // Format dates dynamically
  const formatDateRange = () => {
    try {
      const start = new Date(settings.startDate);
      const end = new Date(settings.endDate);
      const startMonth = start.toLocaleDateString("en-US", { month: "short" });
      const endMonth = end.toLocaleDateString("en-US", { month: "short" });
      const startDay = start.getDate();
      const endDay = end.getDate();
      const year = start.getFullYear();
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
      } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
      }
    } catch (e) {
      return "July 25 - 27, 2026";
    }
  };

  const getDepartureDateStr = () => {
    try {
      const start = new Date(settings.startDate);
      return start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch (e) {
      return "July 25";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="sticky top-0 w-full z-40 flex justify-between items-center px-6 md:px-10 h-16 bg-surface-container-lowest/95 backdrop-blur-sm border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <img
            src="/mss-ikeja-logo.png"
            alt="MSSN Ikeja Logo"
            className="w-10 h-10 object-contain hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-primary tracking-tight leading-none">MSSN Ikeja</h1>
            <span className="text-[9px] font-bold text-on-surface-variant tracking-wider uppercase leading-none mt-0.5">Area Council HTC</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 h-full">
          <a
            href="#hero"
            onClick={() => setActiveNav("home")}
            className={`text-sm font-semibold h-full flex items-center transition-colors ${
              activeNav === "home"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={() => setActiveNav("about")}
            className={`text-sm font-semibold h-full flex items-center transition-colors ${
              activeNav === "about"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            About
          </a>
          <a
            href="#highlights"
            onClick={() => setActiveNav("highlights")}
            className={`text-sm font-semibold h-full flex items-center transition-colors ${
              activeNav === "highlights"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Highlights
          </a>
          <a
            href="#venue"
            onClick={() => setActiveNav("venue")}
            className={`text-sm font-semibold h-full flex items-center transition-colors ${
              activeNav === "venue"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Venue
          </a>
          <a
            href="#stats"
            onClick={() => setActiveNav("stats")}
            className={`text-sm font-semibold h-full flex items-center transition-colors ${
              activeNav === "stats"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Stats
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-4 py-2 border border-primary text-primary text-sm font-bold rounded-lg hover:bg-primary-container/10 transition-colors"
          >
            Check Status
          </button>
          <Link
            href="/admin/login"
            className="px-4 py-2 text-on-surface-variant hover:text-primary text-sm font-bold transition-colors"
          >
            Admin Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative py-20 px-6 md:px-10 max-w-container-max mx-auto w-full flex flex-col items-center text-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold rounded-full">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            July Session Registration is Open
          </div>
          <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase italic mt-1 block">
            "La ilaha illallah Muhammadur-Rasuulul Allah"
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold text-on-surface leading-tight tracking-tight max-w-4xl">
          Holiday Training Course (HTC): <br />
          <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Spiritual Renewal, Vocations & Leadership</span>
        </h2>
        <p className="text-lg text-on-surface-variant max-w-2xl">
          Empowering Muslim students with sound Islamic knowledge, moral integrity, academic guidance, and contemporary life skills. Join us for a life-transforming 3-day mid-year residential camp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link
            href="/register"
            className="px-8 py-4 bg-primary text-white text-base font-bold rounded-lg hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 animate-bounce-subtle flex items-center justify-center gap-2"
          >
            Register for HTC
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-8 py-4 border border-outline text-on-surface-variant text-base font-bold rounded-lg hover:bg-surface-container/50 transition-all flex items-center justify-center gap-2"
          >
            Check Registration Status
          </button>
        </div>

        {/* Quick Date and Venue Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-6 max-w-3xl">
          <div className="flex items-center gap-3 px-5 py-3 bg-surface-container rounded-xl border border-outline-variant">
            <Calendar className="text-primary w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-on-surface-variant">Camp Dates</p>
              <p className="text-sm font-bold">{formatDateRange()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 bg-surface-container rounded-xl border border-outline-variant">
            <MapPin className="text-primary w-5 h-5" />
            <div className="text-left">
              <p className="text-xs text-on-surface-variant">Camp Venue</p>
              <p className="text-sm font-bold">Al-Hikmat Nursery & Primary School, Agege, Lagos</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-video bg-gradient-to-tr from-primary to-accent flex items-center justify-center p-8 text-center text-white">
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative flex flex-col items-center gap-4">
              <img
                src="/mss-ikeja-logo.png"
                alt="MSSN Ikeja Logo"
                className="w-24 h-24 object-contain filter drop-shadow-md animate-pulse"
              />
              <h4 className="text-xl font-extrabold uppercase tracking-wider">MSSN Ikeja Area Council</h4>
              <p className="text-xs font-semibold max-w-md italic opacity-90">
                "La ilaha illallah Muhammadur-Rasuulul Allah"
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Who We Are</span>
            <h3 className="text-3xl font-extrabold text-on-surface leading-tight">
              Nurturing Muslim Youths for Faith, Academic Distinction & Leadership
            </h3>
            <p className="text-on-surface-variant leading-relaxed">
              The Muslim Students' Society of Nigeria (MSSN), Ikeja Area Council, is the premier student body coordinating Islamic activities and representing Muslim students across primary, secondary, and tertiary institutions, as well as school-leavers, within the Ikeja and Ojodu Local Government areas of Lagos State.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              While the state-wide **Islamic Vacation Course (IVC)** is held in December, the **Holiday Training Course (HTC)** is Ikeja's localized, residential training camp. The HTC is designed specifically to utilize the school vacation period to protect students from negative societal influences by immersing them in a vibrant, supportive, and spiritually uplifting Islamic learning environment.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-surface-container border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-6 md:px-10 w-full">
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-10 text-on-surface">Camp Live Attendance & Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-primary/10 text-primary rounded-xl">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Registrations Submitted</p>
                <p className="text-3xl font-extrabold">{totalDelegates}</p>
                <p className="text-xs text-on-surface-variant mt-1">Pending + Confirmed</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-success/10 text-success rounded-xl">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Confirmed Attendance</p>
                <p className="text-3xl font-extrabold text-success">{totalVerified}</p>
                <p className="text-xs text-on-surface-variant mt-1">Payments Verified</p>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-accent/10 text-accent rounded-xl">
                <Armchair className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs text-on-surface-variant">Capacity Slots Left</p>
                <p className="text-3xl font-extrabold text-primary">{capacityLeft}</p>
                <p className="text-xs text-on-surface-variant mt-1">Limit: {settings.capacityLimit} delegates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="py-20 max-w-container-max mx-auto px-6 md:px-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">Our Pillars</span>
          <h3 className="text-3xl font-extrabold mb-4 text-on-surface">What HTC Offers You</h3>
          <p className="text-on-surface-variant">
            A holistic, residential training curriculum designed to nurture your spiritual devotion, practical capabilities, and communal bonds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col gap-5 hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all">
              📖
            </div>
            <h4 className="text-xl font-bold text-on-surface">Tarbiyyah & Devotion</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Daily congregational Solah, Qiyamul-Layl (Tahajjud), morning Adh-dhikr, and soul-inspiring Tafseer and Fiqh classes led by seasoned Islamic scholars.
            </p>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col gap-5 hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all">
              💻
            </div>
            <h4 className="text-xl font-bold text-on-surface">Vocations & Technology</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Practical workshops in digital literacy (web dev, graphics design) alongside self-reliance skills like catering, baking, and soap-making.
            </p>
          </div>

          <div className="bg-surface-container-low p-8 rounded-3xl border border-outline-variant flex flex-col gap-5 hover:shadow-lg transition-all group hover:-translate-y-1">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all">
              🤝
            </div>
            <h4 className="text-xl font-bold text-on-surface">Islamic Brotherhood</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Building lifetime bonds, unity, and healthy networking through team sports, debates, collaborative problem-solving, and shared living.
            </p>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="py-20 bg-surface-container-low border-t border-outline-variant">
        <div className="max-w-container-max mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h3 className="text-3xl font-extrabold text-on-surface">Camp Venue</h3>
            <p className="text-on-surface-variant leading-relaxed">
              Our venue is carefully selected to provide a tranquil yet accessible environment conducive to intensive learning, worship, and spiritual reflection.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
                <Building className="text-primary w-6 h-6 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Al-Hikmat Nursery & Primary School</p>
                  <p className="text-xs text-on-surface-variant">45 Adedosu Street, Keke, Agege, Lagos State, Nigeria</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant">
                <Bus className="text-primary w-6 h-6 shrink-0" />
                <div>
                  <p className="font-bold text-sm">Coordinated Transport</p>
                  <p className="text-xs text-on-surface-variant">Departure from Ikeja Central Mosque at 8:00 AM on {getDepartureDateStr()}</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 italic text-primary font-medium text-sm">
              \"A serene environment is the first step towards a peaceful heart. We've secured a facility that honors that principle.\"
            </div>
          </div>

          {/* Map placeholder */}
          <div className="relative h-[400px] bg-gradient-to-br from-primary-container/20 to-accent/15 rounded-3xl overflow-hidden border border-outline-variant shadow-lg flex flex-col justify-between p-8">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-primary">Agege, Lagos</h4>
                <p className="text-xs text-on-surface-variant">Al-Hikmat Nursery & Primary School</p>
              </div>
              <span className="p-2 bg-white rounded-full text-primary shadow-md">
                <MapPin className="w-5 h-5" />
              </span>
            </div>
            
            <div className="my-auto flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center animate-ping absolute" />
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white relative shadow-lg">
                📍
              </div>
              <span className="text-sm font-bold text-on-surface mt-2">Al-Hikmat Nursery & Primary School Area</span>
            </div>

            <button
              onClick={() => window.open("https://maps.google.com/?q=45+Adedosu+Street,+Keke,+Agege,+Lagos", "_blank")}
              className="w-full py-3 bg-white text-primary text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <Map className="w-4 h-4" />
              Open in Google Maps
            </button>
          </div>
        </div>
      </section>

      {/* Status Lookup Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setErrorMsg("");
                setIdentifier("");
              }}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-xl font-bold text-primary mb-3">Check Registration Status</h4>
            <p className="text-sm text-on-surface-variant mb-6">
              Enter the Email address or Payment Reference ID (`REF-XXXXXXXX`) you used during registration to access your digital badge and details.
            </p>

            <form onSubmit={handleCheckStatus} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface-variant">Email / Reference ID</label>
                <input
                  type="text"
                  placeholder="e.g. abdullah@example.com or REF-1720894562"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full px-4 py-3 bg-surface-container rounded-lg border border-outline-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-accent/20 transition-all text-sm"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-error font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/95 transition-all text-sm flex items-center justify-center gap-2"
              >
                Access Dashboard
                <LogIn className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto py-10 bg-surface-container-lowest border-t border-outline-variant px-6 md:px-10 text-center">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-on-surface-variant">
            &copy; 2026 MSSN Ikeja Area Council. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-on-surface-variant">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
