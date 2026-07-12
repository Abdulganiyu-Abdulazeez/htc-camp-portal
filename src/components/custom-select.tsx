"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: "default" | "compact";
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  size = "default",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  const isCompact = size === "compact";

  return (
    <div className={`flex flex-col gap-1.5 relative w-full ${isCompact ? "min-w-[110px]" : ""}`} ref={containerRef}>
      {label && <label className="text-xs font-semibold text-on-surface-variant">{label}</label>}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center bg-surface-container border border-outline-variant hover:border-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-accent/20 transition-all text-left font-semibold disabled:opacity-50 disabled:cursor-not-allowed ${
          isCompact
            ? "px-2.5 py-1.5 text-[11px] rounded-md text-primary"
            : "px-4 py-3 text-sm rounded-lg text-on-surface"
        }`}
      >
        <span className={selectedOption ? "" : "text-on-surface-variant/70"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`text-on-surface-variant transition-transform duration-200 shrink-0 ${isCompact ? "w-3 h-3 ml-1" : "w-4 h-4 ml-2"} ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl z-50 py-1 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-100">
          {options.length === 0 ? (
            <div className={`px-4 py-2 text-on-surface-variant ${isCompact ? "text-[10px]" : "text-xs"}`}>No options available</div>
          ) : (
            options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left font-semibold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between ${
                  isCompact ? "px-3 py-1.5 text-[10px]" : "px-4 py-2.5 text-xs"
                } ${value === opt.value ? "bg-primary/10 text-primary font-bold" : "text-on-surface"}`}
              >
                <span>{opt.label}</span>
                {value === opt.value && <span className="text-primary font-bold">✓</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
