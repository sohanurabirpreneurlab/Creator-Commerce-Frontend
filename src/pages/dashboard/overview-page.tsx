import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

const overviewCards = [
  {
    title: "Active Campaigns",
    value: "04",
    description: "Campaigns you are currently participating in will appear here.",
  },
  {
    title: "Pending Applications",
    value: "09",
    description: "Track applications waiting for brand review and selection.",
  },
  {
    title: "Content Waiting Approval",
    value: "03",
    description: "Submitted content will surface here with approval feedback.",
  },
  {
    title: "Estimated Earnings",
    value: "$1,240",
    description: "Future estimated earnings and payout summaries will show here.",
  },
];

export function OverviewPage() {
  const { user } = useAuth();

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Creator Overview
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, {user?.name ?? "Creator"}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
          This creator dashboard is the protected workspace for campaign discovery,
          application tracking, submissions, links, performance, and earnings.
          The cards below are placeholder summaries until the matching APIs are added.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className="p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              {card.title}
            </p>
            <p className="mt-4 text-4xl font-extrabold tracking-tight text-foreground">
              {card.value}
            </p>
            <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-7">
        <h3 className="text-lg font-bold text-foreground">What comes next</h3>
        <div className="mt-5 grid gap-3">
          {[
            "Campaign recommendations tailored to the creator profile and niche.",
            "Application status timelines with brand feedback and next actions.",
            "Creator revenue, conversion, and attribution summaries from tracking data.",
          ].map((feature) => (
            <div
              key={feature}
              className="rounded-3xl border border-border bg-slate-50 px-5 py-4 text-sm leading-6 text-muted"
            >
              {feature}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
