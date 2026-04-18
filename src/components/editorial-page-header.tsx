import type { ReactNode } from "react";

type Props = {
  sectionLabel?: string;
  overline?: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
};

export function EditorialPageHeader({
  sectionLabel,
  overline,
  title,
  lede,
  children,
}: Props) {
  return (
    <section className="ed-section">
      {sectionLabel && <div className="ed-section-label">{sectionLabel}</div>}
      <div className="ed-wrap">
        {overline && <div className="ed-overline">{overline}</div>}
        <h1 className="text-section-h2" style={{ margin: 0 }}>
          {title}
        </h1>
        {lede && (
          <p className="text-lede" style={{ marginTop: 24, maxWidth: 640 }}>
            {lede}
          </p>
        )}
        {children && <div style={{ marginTop: 32 }}>{children}</div>}
      </div>
    </section>
  );
}
