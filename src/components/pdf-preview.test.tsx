import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PdfPreview } from "./pdf-preview";

const SRC = "https://example.public.blob.vercel-storage.com/resources/deck.pdf";

describe("PdfPreview", () => {
  // Regression: the iframe mounted on page load, so every visit pulled the
  // full PDF from Blob and spent Fast Origin Transfer on cache misses.
  it("does not request the PDF until the reader asks for it", () => {
    const { container } = render(<PdfPreview src={SRC} title="Deck" />);
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("mounts the viewer after a click", () => {
    render(<PdfPreview src={SRC} title="Deck" />);
    fireEvent.click(screen.getByRole("button", { name: /preview the pdf/i }));

    const frame = screen.getByTitle("Deck");
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute("src", SRC);
  });
});
