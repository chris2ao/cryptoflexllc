export const OPEN_COMMAND_PALETTE_EVENT = "cryptoflex:open-command-palette";

/** Ask the mounted CommandPalette to open (used by touch-friendly search buttons). */
export function openCommandPalette(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE_EVENT));
}
