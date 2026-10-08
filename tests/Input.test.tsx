import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "@/components/ui/Input";

describe("Input", () => {
  it("renders with label and controlled value", () => {
    const onChange = vi.fn();
    render(
      <Input
        variant="email"
        label="Email address"
        placeholder="Enter your email"
        value="ada@orivex.xyz"
        onChange={onChange}
      />
    );
    const input = screen.getByLabelText("Email address") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe("ada@orivex.xyz");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("inputMode", "email");
  });

  it("merges caller-passed className with internal classes", () => {
    render(
      <Input
        variant="email"
        label="Email address"
        value=""
        onChange={() => {}}
        className="custom-class"
        data-testid="input-email"
      />
    );
    const input = screen.getByTestId("input-email");
    const className = input.className;
    expect(className).toContain("w-full");
    expect(className).toContain("rounded-lg");
    expect(className).toContain("custom-class");
  });

  it("associates error message with input via aria-describedby when in error state", () => {
    render(
      <Input
        variant="email"
        label="Email address"
        value="bad-email"
        onChange={() => {}}
        state="error"
        errorMessage="Please enter a valid email address"
      />
    );
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const errorId = input.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Please enter a valid email address"
    );
    expect(document.getElementById(errorId!)).toHaveTextContent(
      "Please enter a valid email address"
    );
  });

  it("handles uncontrolled and onBlur behavior", () => {
    const onBlur = vi.fn();
    render(
      <Input
        variant="email"
        label="Email address"
        onBlur={onBlur}
        data-testid="input-uncontrolled"
      />
    );
    const input = screen.getByTestId("input-uncontrolled");
    fireEvent.blur(input);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("passes other props (like maxLength) through to input", () => {
    render(
      <Input
        variant="email"
        label="Email address"
        value=""
        onChange={() => {}}
        maxLength={50}
        data-testid="input-maxlen"
      />
    );
    const input = screen.getByTestId("input-maxlen");
    expect(input).toHaveAttribute("maxLength", "50");
  });

  it("pin variant sets numeric inputMode and maxLength 6", () => {
    render(
      <Input
        variant="pin"
        label="PIN"
        value=""
        onChange={() => {}}
        data-testid="input-pin"
      />
    );
    const input = screen.getByTestId("input-pin");
    expect(input).toHaveAttribute("inputMode", "numeric");
    expect(input).toHaveAttribute("maxLength", "6");
  });

  it("works in filled/error/default states appropriately", () => {
    const { rerender } = render(
      <Input
        variant="email"
        label="Email address"
        value="filled@example.com"
        onChange={() => {}}
        state="filled"
        data-testid="input-state"
      />
    );
    expect(screen.getByTestId("input-state")).toBeInTheDocument();
    rerender(
      <Input
        variant="email"
        label="Email address"
        value="bad"
        onChange={() => {}}
        state="error"
        errorMessage="Error"
        data-testid="input-state2"
      />
    );
    expect(screen.getByTestId("input-state2")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });
});
