// Skeleton fallbacks for Suspense boundaries and lazy charts.

export function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse bg-muted/20 rounded-lg" />
  );
}

export function TallChartSkeleton() {
  return (
    <div className="h-[400px] w-full animate-pulse bg-muted/20 rounded-lg" />
  );
}

export function SectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted/20 rounded" />
      <div className="grid lg:grid-cols-2 gap-8">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse bg-muted/20 rounded-lg" />
        ))}
      </div>
      <TallChartSkeleton />
      <ChartSkeleton />
    </div>
  );
}

export function ContentSkeleton() {
  return <SectionSkeleton />;
}

export function ReadersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse bg-muted/20 rounded" />
      <div className="grid lg:grid-cols-3 gap-8">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    </div>
  );
}

export function TelemetrySkeleton() {
  return <SectionSkeleton />;
}

export function SecuritySkeleton() {
  return <SectionSkeleton />;
}

export function NewsletterSkeleton() {
  return <SectionSkeleton />;
}
