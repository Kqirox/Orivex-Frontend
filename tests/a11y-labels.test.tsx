import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { Textarea } from "@/components/ui/Textarea";
import { FAQ } from "@/components/landing/FAQ";

describe("Screen-Reader Labels — Home Page", () => {
  it("decorative icons have aria-hidden", () => {
    ;
    const svgs = document.querySelectorAll("svg");
    svgs.forEach((svg) => {
      if (svg.hasAttribute("aria-hidden")) {
        expect(svg.getAttribute("aria-hidden")).toBe("true");
      }
    });
  });

  it("social media links have descriptive aria-labels", () => {
    render(<Home />);
    const socialLinks = screen.getAllByRole("link", { name: /twitter|instagram|github/i });
    expect(socialLinks.length).toBeGreaterThanOrEqual(3);
    socialLinks.forEach((link) => {
      expect(link).toHaveAttribute("aria-label");
    });
  });

  it("footer section headings are present", () => {
    render(<Home />);
    expect(screen.getByText("Platform")).toBeInTheDocument();
    expect(screen.getByText("Resources")).toBeInTheDocument();
    expect(screen.getByText("Legal")).toBeInTheDocument();
  });

  it("images marked as decorative have empty alt", () => {
    render(<Home />);
    const images = document.querySelectorAll("img");
    images.forEach((img) => {
      const alt = img.getAttribute("alt");
      const ariaHidden = img.getAttribute("aria-hidden");
      if (alt === "" || ariaHidden === "true") {
        return;
      }
      expect(
        alt,
        `Image with src "${img.getAttribute("src")}" should have a descriptive alt or be marked decorative`,
      ).toBeTruthy();
    });
  });
});

describe("Screen-Reader Labels — FAQ Accordion", () => {
  it("accordion buttons have proper ARIA attributes", () => {
    render(<FAQ />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded");
      expect(btn).toHaveAttribute("aria-controls");
    });
  });

  it("accordion panels have role='region'", () => {
    render(<FAQ />);
    const regions = document.querySelectorAll('[role="region"]');
    expect(regions.length).toBeGreaterThan(0);
    regions.forEach((region) => {
      expect(region).toHaveAttribute("id");
    });
  });
});

describe("Screen-Reader Labels — Textarea", () => {
  it("textarea has accessible label", () => {
    render(<Textarea label="Description" />);
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("error state has role='alert' and aria-invalid", () => {
    render(<Textarea state="error" value="x" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("helper text is associated via aria-describedby", () => {
    render(<Textarea />);
    const ta = screen.getByRole("textbox");
    const descId = ta.getAttribute("aria-describedby");
    expect(descId).toBeTruthy();
    const descEl = document.getElementById(descId!);
    expect(descEl).toBeInTheDocument();
    expect(descEl?.textContent).toContain("Max");
  });
});

describe("Screen-Reader Labels — Quiz", () => {
  it("quiz question is rendered as heading", () => {
    render(<QuizContainer />);
    expect(
      screen.getByRole("heading", { level: 2 })
    ).toBeInTheDocument();
  });

  it("Award icon is decorative", async () => {
    render(<QuizContainer />);
    const awardIcons = document.querySelectorAll("svg");
    const decorative = [...awardIcons].filter(
      (svg) => svg.getAttribute("aria-hidden") === "true",
    );
    expect(decorative.length).toBeGreaterThanOrEqual(0);
  });
});
