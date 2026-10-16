import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionLabel } from "./section-label";

describe("SectionLabel", () => {
  it("zero-pads the index and shows the name", () => {
    const { container } = render(<SectionLabel index={3} name="Selected Work" />);
    expect(container.textContent).toBe("§ 03 / Selected Work");
  });

  it("keeps two-digit indexes as-is", () => {
    const { container } = render(<SectionLabel index={12} name="Twelve" />);
    expect(container.textContent).toBe("§ 12 / Twelve");
  });
});
