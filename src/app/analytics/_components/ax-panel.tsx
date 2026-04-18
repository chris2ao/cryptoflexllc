import type { ReactNode } from "react";

type Props = {
  title?: ReactNode;
  kicker?: ReactNode;
  actions?: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * Reusable editorial panel shell — head (dot + title + kicker + actions),
 * body (children), optional foot. Matches `.ax-panel-card` CSS in globals.
 */
export function AxPanel({
  title,
  kicker,
  actions,
  foot,
  children,
  className,
  bodyClassName,
}: Props) {
  const hasHead = title || kicker || actions;
  return (
    <div className={`ax-panel-card ${className ?? ""}`.trim()}>
      {hasHead && (
        <div className="ax-panel-head">
          {(title || kicker) && (
            <div className="t">
              <span className="dot" aria-hidden="true" />
              {title && <span>{title}</span>}
              {kicker && <span className="n">{kicker}</span>}
            </div>
          )}
          {actions && <div className="actions">{actions}</div>}
        </div>
      )}
      <div className={`ax-panel-body ${bodyClassName ?? ""}`.trim()}>
        {children}
      </div>
      {foot && <div className="ax-panel-foot">{foot}</div>}
    </div>
  );
}
