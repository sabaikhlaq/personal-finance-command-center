export function ScreenLoader() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-40 animate-pulse rounded-3xl bg-muted" />
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-32 animate-pulse rounded-2xl bg-muted" />
      <div className="h-48 animate-pulse rounded-2xl bg-muted" />
    </div>
  )
}
