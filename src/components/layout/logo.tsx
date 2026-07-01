export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 shadow-sm">
        <div className="h-5 w-5 rounded-md bg-primary" />
      </div>
      <div>
        <p className="text-sm font-extrabold tracking-tight text-foreground">
          Creators Lab
        </p>
        <p className="text-xs text-muted">Commerce-first influencer growth</p>
      </div>
    </div>
  );
}
