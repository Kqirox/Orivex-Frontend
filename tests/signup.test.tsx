import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SignupPage from "@/app/signup/page";

describe("Signup screen", () => {
  it("renders the 3-step wizard with initial step 1 content", () => {
    render(<SignupPage />);
    expect(
      screen.getByRole("heading", { name: /Create your account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("6-digit PIN")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  it("has 'Sign in' link pointing to /login", () => {
    render(<SignupPage />);
    const signInLink = screen.getByRole("link", { name: /Sign in/i });
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("validates email and PIN before allowing progression", () => {
    render(<SignupPage />);
    const continueButton = screen.getByRole("button", { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@orivex.xyz" },
    });
    fireEvent.change(screen.getByLabelText("6-digit PIN"), {
      target: { value: "123" },
    });
    expect(continueButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("6-digit PIN"), {
      target: { value: "123456" },
    });
    expect(continueButton).toBeEnabled();
  });

  it("navigates forward and back through steps", () => {
    render(<SignupPage />);
    const emailInput = screen.getByLabelText("Email address");
    const pinInput = screen.getByLabelText("6-digit PIN");
    fireEvent.change(emailInput, { target: { value: "test@orivex.xyz" } });
    fireEvent.change(pinInput, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(
      screen.getByRole("heading", { name: /What do you want to learn/i })
    ).toBeInTheDocument();
    const backButton = screen.getByRole("button", { name: /Back/i });
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(
      screen.getByRole("heading", { name: /Create your account/i })
    ).toBeInTheDocument();
  });

  it("requires interests and skill level to continue from step 2", () => {
    render(<SignupPage />);
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@orivex.xyz" },
    });
    fireEvent.change(screen.getByLabelText("6-digit PIN"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    const continueButton = screen.getByRole("button", { name: /Continue/i });
    expect(continueButton).toBeDisabled();

    const chips = screen.getAllByRole("button", {
      name: /Finance|NFTs|DeFi|AI|Gaming|Identity/i,
    });
    expect(chips.length).toBeGreaterThan(0);
    fireEvent.click(chips[0]);
    expect(continueButton).toBeDisabled();

    const levels = screen.getAllByRole("button", {
      name: /Beginner|Intermediate|Advanced/i,
    });
    fireEvent.click(levels[0]);
    expect(continueButton).toBeEnabled();
  });
});
