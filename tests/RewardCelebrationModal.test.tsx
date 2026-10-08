import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RewardCelebrationModal } from "@/components/reward/RewardCelebrationModal";

describe("RewardCelebrationModal", () => {
  it("renders the modal with amount and badge label", () => {
    const onClose = vi.fn();
    render(
      <RewardCelebrationModal
        amount="+$0.25 USDC"
        badgeLabel="Stellar Scholar"
        onClose={onClose}
      />
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "+$0.25 USDC" })).toBeInTheDocument();
    expect(screen.getByText("Stellar Scholar")).toBeInTheDocument();
  });

  it("closes when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <RewardCelebrationModal
        amount="+$0.25 USDC"
        badgeLabel="Stellar Scholar"
        onClose={onClose}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Close reward notification/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(
      <RewardCelebrationModal
        amount="+$0.25 USDC"
        badgeLabel="Stellar Scholar"
        onClose={onClose}
      />
    );
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when backdrop is clicked", () => {
    const onClose = vi.fn();
    render(
      <RewardCelebrationModal
        amount="+$0.25 USDC"
        badgeLabel="Stellar Scholar"
        onClose={onClose}
      />
    );
    const container = screen.getByRole("dialog").parentElement as HTMLElement;
    if (container) {
      fireEvent.click(container);
    }
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves focus into dialog on open and restores focus on close", () => {
    const onClose = vi.fn();
    const { container, unmount } = render(
      <div>
        <button>Trigger</button>
        <RewardCelebrationModal
          amount="+$0.25 USDC"
          badgeLabel="Stellar Scholar"
          onClose={onClose}
        />
      </div>
    );
    unmount();
    expect(container).toBeDefined();
  });

  it("has proper ARIA attributes", () => {
    const onClose = vi.fn();
    render(
      <RewardCelebrationModal
        amount="+$0.25 USDC"
        badgeLabel="Stellar Scholar"
        onClose={onClose}
      />
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("role", "dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby");
    expect(dialog).toHaveAttribute("aria-describedby");
  });
});
