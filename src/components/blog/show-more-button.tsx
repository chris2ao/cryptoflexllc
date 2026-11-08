interface ShowMoreButtonProps {
  mobileShown: number;
  desktopShown: number;
  total: number;
  hasMoreMobile: boolean;
  hasMoreDesktop: boolean;
  onClick: () => void;
}

export function ShowMoreButton({
  mobileShown,
  desktopShown,
  total,
  hasMoreMobile,
  hasMoreDesktop,
  onClick,
}: ShowMoreButtonProps) {
  if (total === 0 || !(hasMoreMobile || hasMoreDesktop)) return null;
  return (
    <div className={hasMoreDesktop ? "mt-6" : "mt-6 sm:hidden"}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex min-h-11 w-full items-center justify-center gap-1 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Show more posts{" "}
        <span className="sm:hidden">
          ({mobileShown} of {total} shown)
        </span>
        <span className="hidden sm:inline">
          ({desktopShown} of {total} shown)
        </span>
      </button>
    </div>
  );
}
