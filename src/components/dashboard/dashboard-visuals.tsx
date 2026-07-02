import { Card } from "@/components/ui/card";

type BreakdownItem = {
  label: string;
  count: number;
};

const chartColors = [
  "#0ea5e9",
  "#14b8a6",
  "#8b5cf6",
  "#f97316",
  "#f43f5e",
  "#84cc16",
];

function formatLabel(label: string) {
  return label.replaceAll("_", " ");
}

function getChartSegments(items: BreakdownItem[]) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (total === 0) {
    return [];
  }

  let current = 0;

  return items.map((item, index) => {
    const start = (current / total) * 360;
    current += item.count;
    const end = (current / total) * 360;

    return {
      ...item,
      color: chartColors[index % chartColors.length],
      start,
      end,
      percentage: Math.round((item.count / total) * 100),
    };
  });
}

export function DashboardMetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string | number;
  description?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-foreground">{value}</p>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </Card>
  );
}

export function BreakdownBarCard({
  title,
  items,
}: {
  title: string;
  items: BreakdownItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted">No data available yet.</p>
        ) : (
          items.map((item, index) => {
            const width = total > 0 ? (item.count / total) * 100 : 0;

            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">
                    {formatLabel(item.label)}
                  </span>
                  <span className="font-bold text-foreground">{item.count}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(width, item.count > 0 ? 8 : 0)}%`,
                      backgroundColor: chartColors[index % chartColors.length],
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

export function BreakdownDonutCard({
  title,
  items,
}: {
  title: string;
  items: BreakdownItem[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  const segments = getChartSegments(items);
  const background =
    segments.length > 0
      ? `conic-gradient(${segments
          .map(
            (segment) =>
              `${segment.color} ${segment.start}deg ${segment.end}deg`,
          )
          .join(", ")})`
      : "#e2e8f0";

  return (
    <Card className="p-6">
      <h2 className="text-xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-6 grid gap-6 md:grid-cols-[180px_minmax(0,1fr)] md:items-center">
        <div className="mx-auto flex flex-col items-center justify-center">
          <div
            className="relative h-40 w-40 rounded-full"
            style={{ background }}
          >
            <div className="absolute inset-6 flex items-center justify-center rounded-full bg-white shadow-inner">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  Total
                </p>
                <p className="mt-1 text-3xl font-extrabold text-foreground">
                  {total}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {segments.length === 0 ? (
            <p className="text-sm text-muted">No data available yet.</p>
          ) : (
            segments.map((segment) => (
              <div
                key={segment.label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="truncate text-sm font-medium text-foreground">
                    {formatLabel(segment.label)}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">
                    {segment.count}
                  </p>
                  <p className="text-xs text-slate-500">{segment.percentage}%</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
