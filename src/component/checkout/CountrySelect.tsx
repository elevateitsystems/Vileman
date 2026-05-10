"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import { countries } from "@/lib/countries";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function CountrySelect({ value, onChange, error }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((c) => c.code === value);

  const filteredCountries = useMemo(() => {
    return countries.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="text-[12px] font-bold uppercase tracking-widest text-gray-400 mb-2 block">
        Shipping Country
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-full items-center justify-between rounded-xl border bg-white px-4 text-[15px] transition-all focus:ring-1 outline-none ${
          error ? "border-red-500" : "border-gray-100 focus:border-[#2e4857] focus:ring-[#2e4857]"
        }`}
      >
        <span className={selectedCountry ? "text-black" : "text-gray-400"}>
          {selectedCountry ? selectedCountry.name : "Select a country"}
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="sticky top-0 border-b border-gray-50 bg-white p-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                autoFocus
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg bg-gray-50 pl-10 pr-4 text-[14px] outline-none focus:ring-1 focus:ring-[#2e4857]/20"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country.code);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-[14px] hover:bg-gray-50 transition-colors"
                >
                  <span className={value === country.code ? "font-bold text-[#2e4857]" : "text-gray-700"}>
                    {country.name}
                  </span>
                  {value === country.code && <Check size={16} className="text-[#2e4857]" />}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-[13px] text-gray-400">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
