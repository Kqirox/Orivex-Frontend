import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { QuizContainer } from "@/components/quiz/quiz-container";

describe("QuizContainer", () => {
  it("renders initial question and progress", () => {
    render(<QuizContainer />);
    expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    expect(progressBar).toHaveAttribute("aria-valuemax", "5");
    expect(progressBar).toHaveAttribute("aria-valuenow", "1");
  });

  it("displays a heading for the current question", () => {
    render(<QuizContainer />);
    const headings = screen.getAllByRole("heading");
    expect(headings.length).toBeGreaterThan(0);
    expect(
      screen.getByText("What is the Stellar network primarily used for?")
    ).toBeInTheDocument();
  });

  it("allows selecting an answer and shows feedback (locks selection)", () => {
    render(<QuizContainer />);
    const options = screen.getAllByRole("button");
    expect(options.length).toBe(4);
    fireEvent.click(options[0]);
    expect(
      screen.getByText(/Correct answer is|The correct answer is/)
    ).toBeInTheDocument();
    fireEvent.click(options[1]);
    expect(options[0]).toBeDisabled();
  });

  it("shows correct feedback when correct answer is selected", () => {
    render(<QuizContainer />);
    const correctOption = screen.getByRole("button", { name: /Cross-border payments/ });
    fireEvent.click(correctOption);
    expect(screen.getByText("Correct!")).toBeInTheDocument();
  });

  it("shows incorrect feedback when wrong answer is selected", () => {
    render(<QuizContainer />);
    const wrongOption = screen.getByRole("button", { name: /Digital art NFTs/ });
    fireEvent.click(wrongOption);
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
  });

  it("navigates to next question and updates progress", () => {
    render(<QuizContainer />);
    fireEvent.click(screen.getByRole("button", { name: /Cross-border payments/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    expect(screen.getByText(/Question 2 of 5/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "2");
  });

  it("completes quiz and shows results screen at the end", () => {
    render(<QuizContainer />);
    fireEvent.click(screen.getByRole("button", { name: /Cross-border payments/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /XLM/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Stellar Consensus Protocol/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Low-cost, fast/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Rust-based/ }));
    fireEvent.click(screen.getByRole("button", { name: /View Results/ }));
    expect(screen.getByText(/Quiz Complete/)).toBeInTheDocument();
    expect(screen.getByText(/Correct/)).toBeInTheDocument();
  });

  it("shows reward/celebration modal when quiz completes", () => {
    render(<QuizContainer />);
    fireEvent.click(screen.getByRole("button", { name: /Cross-border payments/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /XLM/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Stellar Consensus Protocol/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Low-cost, fast/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Rust-based/ }));
    fireEvent.click(screen.getByRole("button", { name: /View Results/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("restarts quiz when retake button is clicked", () => {
    render(<QuizContainer />);
    fireEvent.click(screen.getByRole("button", { name: /Cross-border payments/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /XLM/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Stellar Consensus Protocol/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Low-cost, fast/ }));
    fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
    fireEvent.click(screen.getByRole("button", { name: /Rust-based/ }));
    fireEvent.click(screen.getByRole("button", { name: /View Results/ }));
    fireEvent.click(screen.getByRole("button", { name: /Retake Quiz/ }));
    expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
  });

  it("shows correct/incorrect styling for options", () => {
    render(<QuizContainer />);
    const wrongOption = screen.getByRole("button", { name: /Digital art NFTs/ });
    fireEvent.click(wrongOption);
    expect(wrongOption).toBeDisabled();
  });

  it("progresses through all questions accumulating answers", () => {
    render(<QuizContainer />);
    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getAllByRole("button")[1]);
      if (i < 4) {
        fireEvent.click(screen.getByRole("button", { name: /Next Question/ }));
      } else {
        fireEvent.click(screen.getByRole("button", { name: /View Results/ }));
      }
    }
    expect(screen.getByText(/Quiz Complete/)).toBeInTheDocument();
  });
});
