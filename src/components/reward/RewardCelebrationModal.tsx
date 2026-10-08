"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CircleDollarSign,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

type RewardCelebrationModalProps = {
  amount: string;
  badgeLabel: string;
  onClose: () => void;
};

const sparkles = [
  { top: "-4px", left: "12%", size: "6px", delay: 0 },
  { top: "8px", left: "72%", size: "8px", delay: 0.14 },
  { top: "68px", left: "24%", size: "5px", delay: 0.08 },
  { top: "54px", left: "82%", size: "7px", delay: 0.18 },
];

export function RewardCelebrationModal({ amount, badgeLabel, onClose }: RewardCelebrationModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    const modal = modalRef.current;
    if (modal) {
      const focusableElements = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modal.focus();
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <motion.div
        ref={modalRef}
        {...motionProps}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reward-modal-title"
        aria-describedby="reward-modal-description"
        tabIndex={-1}
        className="relative z-10 mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.2)] backdrop-blur-sm sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close reward notification"
          className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 top-0 h-24 overflow-hidden">
          <div className="absolute left-1/2 top-6 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl" />
          <div className="absolute -left-8 top-4 h-20 w-20 rounded-full bg-secondary/20 blur-2xl" />
        </div>

        <div className="relative">
          <div className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
            <Sparkles className="h-4 w-4" />
            Reward Unlocked
          </div>

          <div className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0a2540] p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.35)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Celebration bonus
                </p>
                <h2 id="reward-modal-title" className="mt-3 text-4xl font-bold leading-tight tracking-[-0.04em] sm:text-5xl">
                  {amount}
                </h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/10">
                <CircleDollarSign className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p id="reward-modal-description" className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Your reward moment is ready. This design celebration state includes a placeholder for the Stellar explorer link and the wallet confirmation step.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Achievement unlocked
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">
                    {badgeLabel}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                A new badge has been added to your profile. Keep stacking earned achievements as you progress through Stellar learning paths.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Transaction preview</p>
                  <p className="mt-2 text-sm text-slate-600">No blockchain call is executed in this demo.</p>
                </div>
                <div className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-green-700">
                  Pending
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-2xl bg-slate-100 p-3">
                  <span className="text-slate-600">Explorer</span>
                  <a
                    href="#"
                    onClick={(event) => event.preventDefault()}
                    className="inline-flex items-center gap-1 font-semibold text-primary transition-colors hover:text-secondary"
                  >
                    View on Stellar Explorer <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-950">Wallet status</p>
                  <p className="mt-1 text-slate-600">Appears in wallet shortly after reward confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            <Sparkles className="h-4 w-4 text-secondary" />
            Ready to keep learning and earning?
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#005a95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Close
          </button>
        </div>

        {!shouldReduceMotion && (
          <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-between px-4">
            {sparkles.map((sparkle, index) => (
              <motion.span
                key={index}
                animate={{ y: [0, -10, 0], opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: sparkle.delay }}
                className="inline-block rounded-full bg-primary"
                style={{ width: sparkle.size, height: sparkle.size, top: sparkle.top, left: sparkle.left, position: "absolute" }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
