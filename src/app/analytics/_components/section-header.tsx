/**
 * SectionHeader — Category divider for the analytics dashboard.
 * Renders a title + subtitle with consistent spacing.
 */
export function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-14 mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{description}</p>
    </div>
  );
}
