import { describe, expect, it } from "vitest";
import { buildMetadata } from "./seo";

describe("buildMetadata", () => {
  it("builds title with site suffix", () => {
    const metadata = buildMetadata({ title: "Packages" });
    expect(metadata.title).toContain("Packages");
  });
});

