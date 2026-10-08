"use client";

import { useState } from "react";
import { Syne } from "next/font/google";
import { CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"] });

// ── Step 1 data ──────────────────────────────────────────────────────────────
const PIN_LENGTH = 6;

// ── Step 2 data ──────────────────────────────────────────────────────────────
const INTERESTS = [
  "DeFi", "Blockchain Basics", "Stellar", "Smart Contracts",
  "NFTs", "Web3 Dev", "Financial Literacy", "Crypto Trading",
  "Identity & Privacy", "DAOs",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
type Level = (typeof LEVELS)[number];

// ── Helpers ──────────────────────────────────────────────────────────────────
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${step} of 3`}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className={[
            "h-1.5 flex-1 rounded-full transition-all duration-300",
            n <= step ? "bg-[#F5B841]" : "bg-[#E2E8F0]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

// ── Step 1 — Email + PIN ─────────────────────────────────────────────────────
function StepCredentials({
  email, setEmail, pin, setPin, onNext,
}: {
  email: string; setEmail: (v: string) => void;
  pin: string; setPin: (v: string) => void;
  onNext: () => void;
}) {
  const [touched, setTouched] = useState({ email: false, pin: false });

  const emailError = touched.email && !isValidEmail(email);
  const pinError = touched.pin && pin.length !== PIN_LENGTH;
  const canContinue = isValidEmail(email) && pin.length === PIN_LENGTH;

  function handlePinChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, "").slice(0, PIN_LENGTH);
    setPin(v);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`${syne.className} text-[28px] font-bold text-[#0F172A]`}>
          Create your account
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Join thousands of learners earning while they grow.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          variant="email"
          label="Email address"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          state={emailError ? "error" : email && isValidEmail(email) ? "filled" : "default"}
          errorMessage="Please enter a valid email address"
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="pin-input" className="flex items-center gap-1.5 text-[12px] font-medium text-[#475569]">
            PIN (6 digits)
          </label>
          {/* PIN dot display */}
          <div className="flex gap-3 py-2" aria-hidden="true">
            {Array.from({ length: PIN_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={[
                  "h-3 w-3 rounded-full border-2 transition-all",
                  i < pin.length
                    ? "border-[#F5B841] bg-[#F5B841]"
                    : "border-[#E2E8F0] bg-white",
                ].join(" ")}
              />
            ))}
          </div>
          <input
            id="pin-input"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={handlePinChange}
            onBlur={() => setTouched((t) => ({ ...t, pin: true }))}
            maxLength={PIN_LENGTH}
            placeholder="••••••"
            aria-label="6-digit PIN"
            className={[
              "w-full rounded-lg border bg-white px-3 py-2.5 text-[16px] tracking-[0.5em] placeholder-[#94A3B8] transition-colors focus:outline-none focus:border-indigo-500",
              pinError ? "border-[#DC2626] text-[#DC2626]" : "border-[#E2E8F0] text-[#0F172A]",
            ].join(" ")}
          />
          {pinError && (
            <p role="alert" className="text-[12px] text-[#DC2626]">
              PIN must be 6 digits
            </p>
          )}
        </div>
      </div>

      <Button
        variant="primary"
        disabled={!canContinue}
        onClick={onNext}
        className="w-full"
      >
        Continue
      </Button>

      <p className="text-center text-sm text-[#475569]">
        Already have an account?{" "}
        <a href="/login" className="font-medium text-[#14B8A6] hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
}

// ── Step 2 — Interests + Skill Level ────────────────────────────────────────
function StepInterests({
  selected, setSelected, level, setLevel, onNext, onBack,
}: {
  selected: string[]; setSelected: (v: string[]) => void;
  level: Level | null; setLevel: (v: Level) => void;
  onNext: () => void; onBack: () => void;
}) {
  function toggle(item: string) {
    setSelected(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    );
  }

  const canContinue = selected.length > 0 && level !== null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={`${syne.className} text-[28px] font-bold text-[#0F172A]`}>
          What do you want to learn?
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Pick your interests and skill level — we&apos;ll personalise your path.
        </p>
      </div>

      {/* Interest chips */}
      <div>
        <p className="mb-2 text-[12px] font-medium text-[#475569]">
          Select topics ({selected.length} selected)
        </p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((item) => {
            const active = selected.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggle(item)}
                aria-pressed={active}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-[#F5B841] bg-[#F5B841] text-[#0F172A]"
                    : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#F5B841]",
                ].join(" ")}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skill level */}
      <div>
        <p className="mb-2 text-[12px] font-medium text-[#475569]">
          Your current level
        </p>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              aria-pressed={level === l}
              className={[
                "rounded-xl border py-3 text-sm font-medium transition-colors",
                level === l
                  ? "border-[#14B8A6] bg-[#14B8A6]/10 text-[#0F172A]"
                  : "border-[#E2E8F0] bg-white text-[#475569] hover:border-[#14B8A6]",
              ].join(" ")}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="primary"
          disabled={!canContinue}
          onClick={onNext}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

// ── Step 3 — Welcome bonus ───────────────────────────────────────────────────
function StepWelcome({ email, onDone }: { email: string; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Reward badge */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F5B841]/20">
        <span className="text-4xl" role="img" aria-label="gift">🎁</span>
      </div>

      <div>
        <h1 className={`${syne.className} text-[28px] font-bold text-[#0F172A]`}>
          You&apos;re in!
        </h1>
        <p className="mt-1 text-sm text-[#475569]">
          Welcome to Orivex, <span className="font-medium text-[#0F172A]">{email}</span>
        </p>
      </div>

      {/* Bonus card */}
      <div className="w-full rounded-2xl border border-[#F5B841]/50 bg-gradient-to-br from-[#FEF3C7] to-[#FFF] p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-[#D97706]">
          Welcome Bonus
        </p>
        <p className="mt-1 text-[36px] font-bold text-[#0F172A]">
          $0.50{" "}
          <span className="text-[20px] font-medium text-[#475569]">USDC</span>
        </p>
        <p className="mt-1 text-sm text-[#475569]">
          Credited to your wallet once your first lesson is complete.
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[#16A34A]">
          <CheckCircle size={14} aria-hidden="true" />
          Powered by Stellar blockchain
        </div>
      </div>

      <Button variant="primary" onClick={onDone} className="w-full">
        Start Learning
      </Button>

      <p className="text-xs text-[#94A3B8]">
        Your progress and rewards are stored securely on-chain.
      </p>
    </div>
  );
}

// ── Page shell ───────────────────────────────────────────────────────────────
export default function SignupPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");

  // Step 2
  const [interests, setInterests] = useState<string[]>([]);
  const [level, setLevel] = useState<Level | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-10 font-[Inter,system-ui,sans-serif]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo-icon.svg" alt="Orivex" className="h-7 w-7" />
          <span className={`${syne.className} text-[18px] font-bold text-[#0F172A]`}>
            Orivex
          </span>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
          {/* Progress */}
          <div className="mb-6">
            <ProgressBar step={step} />
            <p className="mt-2 text-[12px] text-[#94A3B8]">Step {step} of 3</p>
          </div>

          {step === 1 && (
            <StepCredentials
              email={email} setEmail={setEmail}
              pin={pin} setPin={setPin}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <StepInterests
              selected={interests} setSelected={setInterests}
              level={level} setLevel={setLevel}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <StepWelcome
              email={email}
              onDone={() => alert("Onboarding complete — navigate to /dashboard")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
