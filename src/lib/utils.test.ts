import { describe, expect, it } from "vitest";
import { formatCurrency, cn } from "./utils";

describe("formatCurrency", () => {
  it("formats values in INR without decimals", () => {
    expect(formatCurrency(150000)).toBe("₹1,50,000");
  });
});

describe("cn helper", () => {
  it("merges class names", () => {
    expect(cn("text", false && "hidden", "font-bold")).toBe("text font-bold");
  });
});

