// src/components/ui/select.tsx
import React from "react";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

export function Select({ value, onChange, options, placeholder, className }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`border border-gray-300 rounded px-2 py-1 ${className || ""}`}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Dummy wrappers to satisfy imports
export function SelectTrigger({ children }: any) {
  return <div>{children}</div>;
}
export function SelectValue({ children }: any) {
  return <div>{children}</div>;
}
export function SelectContent({ children }: any) {
  return <div>{children}</div>;
}
export function SelectItem({ children }: any) {
  return <div>{children}</div>;
}
