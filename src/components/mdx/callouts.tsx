import type { ReactNode } from "react";

interface CalloutProps {
  children: ReactNode;
  title?: string;
}

/** Exclamation triangle — draw attention to something important */
function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

/** Octagon stop sign — pause and read carefully */
function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/** Info circle — supplemental context */
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

/** Lightbulb — tips and best practices */
function TipIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

/** Shield check — security-related note */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

const calloutStyles = {
  warning: {
    border: "border-l-amber-500",
    bg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    Icon: WarningIcon,
    defaultTitle: "Warning",
  },
  stop: {
    border: "border-l-red-500",
    bg: "bg-red-500/10",
    iconColor: "text-red-500",
    Icon: StopIcon,
    defaultTitle: "Important",
  },
  info: {
    border: "border-l-primary",
    bg: "bg-primary/10",
    iconColor: "text-primary",
    Icon: InfoIcon,
    defaultTitle: "Note",
  },
  tip: {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    Icon: TipIcon,
    defaultTitle: "Tip",
  },
  security: {
    border: "border-l-primary",
    bg: "bg-primary/5",
    iconColor: "text-primary",
    Icon: ShieldIcon,
    defaultTitle: "Security Note",
  },
} as const;

function Callout({
  variant,
  title,
  children,
}: CalloutProps & { variant: keyof typeof calloutStyles }) {
  const style = calloutStyles[variant];
  return (
    <div
      className={`not-prose my-6 rounded-r-lg border-l-4 ${style.border} ${style.bg} p-4`}
    >
      <div className="flex items-start gap-3">
        <style.Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconColor}`} />
        <div>
          <p className={`font-semibold ${style.iconColor} text-sm`}>
            {title ?? style.defaultTitle}
          </p>
          <div className="mt-1 text-sm text-foreground/80">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Warning({ children, title }: CalloutProps) {
  return <Callout variant="warning" title={title}>{children}</Callout>;
}

export function Stop({ children, title }: CalloutProps) {
  return <Callout variant="stop" title={title}>{children}</Callout>;
}

export function Info({ children, title }: CalloutProps) {
  return <Callout variant="info" title={title}>{children}</Callout>;
}

export function Tip({ children, title }: CalloutProps) {
  return <Callout variant="tip" title={title}>{children}</Callout>;
}

export function Security({ children, title }: CalloutProps) {
  return <Callout variant="security" title={title}>{children}</Callout>;
}
