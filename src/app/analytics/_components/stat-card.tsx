export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl sm:text-3xl font-bold">{value}</p>
    </div>
  );
}
