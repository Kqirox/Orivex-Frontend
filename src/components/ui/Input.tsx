"use client";

import { useId, useState } from "react";
import { Mail, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type InputState = "default" | "focus" | "filled" | "error";
type InputVariant = "email" | "pin";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  variant?: InputVariant;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  state?: InputState;
  errorMessage?: string;
  maxLength?: number;
}

export function Input({
  variant = "email",
  label,
  placeholder,
  value: valueProp,
  onChange,
  state: forcedState,
  errorMessage = "Email is not valid",
  maxLength,
  ...rest
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;

  const state: InputState =
    forcedState ??
    (focused ? "focus" : value.length > 0 ? "filled" : "default");

  const isError = state === "error";
  const isFilled = state === "filled";

  const borderClass = isError
    ? "border-[#DC2626]"
    : state === "focus"
    ? "border-indigo-500"
    : "border-[#E2E8F0]";

  const defaultLabel = variant === "pin" ? "PIN" : "Email";
  const defaultPlaceholder =
    variant === "pin" ? "Enter 6-digit PIN" : "Enter email";
  const inputType =
    variant === "pin" ? (showPin ? "text" : "password") : "email";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  }

  return (
    <div className="flex flex-col gap-1 font-[Inter,system-ui,sans-serif]">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569]"
      >
        <Mail size={12} aria-hidden="true" />
        {label ?? defaultLabel}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? defaultPlaceholder}
          maxLength={maxLength ?? (variant === "pin" ? 6 : undefined)}
          inputMode={variant === "pin" ? "numeric" : "email"}
          aria-invalid={isError}
          aria-describedby={isError ? errorId : undefined}
          {...rest}
          className={cn(
            "w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-[16px] placeholder-[#94A3B8] transition-colors focus:outline-none",
            borderClass,
            isError ? "text-[#DC2626]" : "text-[#0F172A]",
            rest.className
          )}
        />

        {/* Right icon */}
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          {isError ? (
            <AlertCircle size={16} className="text-[#DC2626]" aria-hidden />
          ) : isFilled ? (
            <CheckCircle size={16} className="text-[#16A34A]" aria-hidden />
          ) : variant === "pin" ? (
            <button
              type="button"
              className="pointer-events-auto text-[#94A3B8] hover:text-[#475569]"
              onClick={() => setShowPin((v) => !v)}
              aria-label={showPin ? "Hide PIN" : "Show PIN"}
            >
              {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : null}
        </span>
      </div>

      {isError && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-[12px] text-[#DC2626]"
        >
          <AlertCircle size={12} aria-hidden />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
