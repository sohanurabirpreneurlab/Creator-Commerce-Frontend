import {
  Activity,
  ArrowRight,
  Bot,
  ChartColumn,
  ChartNoAxesCombined,
  Check,
  Link2,
  LockKeyhole,
  Microscope,
  MousePointerClick,
  Radar,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { HeroSection } from "@/components/landing/hero";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const painPoints = [
  {
    title: "Manual Link Creation",
    description:
      "Creators get links over chat threads and spreadsheets that break attribution.",
    icon: Link2,
  },
  {
    title: "Fragmented Data",
    description:
      "Campaign spend, clicks, and revenue live across dashboards with no shared truth.",
    icon: Workflow,
  },
  {
    title: "Attribution Gaps",
    description:
      "Brands struggle to prove which creator drove the transaction, not just the traffic.",
    icon: Target,
  },
  {
    title: "Payment Friction",
    description:
      "Rewarding creators fairly becomes manual reconciliation instead of automated payout logic.",
    icon: LockKeyhole,
  },
  {
    title: "Zero ROI Visibility",
    description:
      "You cannot scale the right partnerships if ROI is buried in post-campaign analysis.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Scaling Plateaus",
    description:
      "Without reliable performance data, high-potential creators look the same as underperformers.",
    icon: TrendingUp,
  },
];

const workflowSteps = [
  {
    title: "Create Campaign",
    description:
      "Define products, commission rules, and goals for every launch in one place.",
  },
  {
    title: "Select Creators",
    description:
      "Invite your roster or shortlist ideal partners using AI-led matching signals.",
  },
  {
    title: "Generate Links",
    description:
      "Create unique tracking links, offers, and attribution rules for every creator.",
  },
  {
    title: "Measure ROI",
    description:
      "Track clicks, conversions, revenue, and reward performance from a single dashboard.",
  },
];

const features = [
  { title: "ROI Attribution", description: "Tie creator activity directly to revenue outcomes.", icon: ChartColumn },
  { title: "Creator CRM", description: "Organize campaigns, notes, tiers, and partner lifecycle.", icon: Radar },
  { title: "Prediction Engine", description: "Forecast campaign performance before launch.", icon: Sparkles },
  { title: "Fraud Prevention", description: "Flag suspicious traffic and conversion anomalies.", icon: ShieldCheck },
  { title: "Instant Insights", description: "See top performers, weak links, and revenue trends.", icon: Activity },
  { title: "Performance Links", description: "Create branded links with creator-level tracking.", icon: Link2 },
  { title: "Commerce Analytics", description: "Surface revenue, AOV, CVR, and ROAS in one view.", icon: Microscope },
  { title: "Bulk Workflows", description: "Launch and manage creator cohorts without spreadsheet ops.", icon: Zap },
  { title: "Creator Discovery", description: "Find partners who fit audience and commerce goals.", icon: ScanSearch },
  { title: "Click Analytics", description: "Understand traffic quality across placements and channels.", icon: MousePointerClick },
];

const creatorRows = [
  { creator: "Creator A", clicks: "4.8K", orders: "34", revenue: "$72,400", roas: "9.4x" },
  { creator: "Creator B", clicks: "3.1K", orders: "19", revenue: "$39,100", roas: "6.8x" },
  { creator: "Creator C", clicks: "5.2K", orders: "41", revenue: "$92,300", roas: "10.2x" },
];

const integrations = ["Shopify", "Meta Ads", "Google Analytics", "TikTok Shop", "Klaviyo", "Stripe"];

const footerColumns = {
  Platform: ["Dashboard", "Campaigns", "Analytics", "Creator CRM"],
  Resources: ["Documentation", "Case Studies", "Blog", "Security"],
  Company: ["About", "Careers", "Contact", "Privacy Policy"],
};

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow ? (
        <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.24em] text-primary-dark">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function SectionShell({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <div className="container-shell">{children}</div>
    </section>
  );
}

function ProblemSection() {
  return (
    <SectionShell id="problem">
      <SectionHeading
        centered
        title="Influencer campaigns are still managed manually"
        description="Most teams still coordinate links, payments, and reporting across tools, which makes true performance attribution slow and unreliable."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {painPoints.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="rounded-[24px] p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4f2] text-[#ef7d62]">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

function SolutionSection() {
  return (
    <SectionShell id="solution" className="bg-slate-50/80">
      <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Solution"
            title="One platform to launch, track, and measure creator campaigns"
            description="Creators Lab unifies creator discovery, campaign operations, unique link generation, attribution, analytics, and performance rewards into one commerce-first workflow."
          />
          <div className="mt-8 space-y-4">
            {[
              "Give every creator unique links and commission rules.",
              "Track clicks, conversions, and sales in real time.",
              "Automate performance-based creator rewards.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary-dark">
                  <Check className="h-4 w-4" />
                </div>
                <p className="text-base text-muted">{item}</p>
              </div>
            ))}
          </div>
          <Button size="lg" className="mt-8 gap-2">
            Explore the Platform
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <Card className="rounded-[32px] p-5 sm:p-7">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-primary/10 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Total Clicks
              </p>
              <p className="mt-3 text-4xl font-extrabold text-foreground">124K</p>
            </div>
            <div className="rounded-[24px] bg-accent-peach p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">
                Conversion Value
              </p>
              <p className="mt-3 text-4xl font-extrabold text-foreground">$84,200</p>
            </div>
          </div>
          <div className="mt-4 rounded-[28px] border border-slate-100 bg-slate-50 p-5">
            <div className="flex items-end gap-3">
              {[50, 82, 68, 104, 124, 116].map((height, index) => (
                <div key={height} className="flex-1">
                  <div
                    className={`rounded-t-2xl ${index === 4 ? "bg-primary" : "bg-slate-300"}`}
                    style={{ height: `${height}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-full bg-primary px-4 py-3 text-center text-sm font-bold text-white">
              Campaign Performance
            </div>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}

function WorkflowSection() {
  return (
    <SectionShell id="how-it-works">
      <SectionHeading
        centered
        title="A simple workflow for complex scaling"
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-4">
        {workflowSteps.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-extrabold text-primary shadow-soft">
              {index + 1}
            </div>
            <h3 className="mt-5 text-xl font-bold text-foreground">{step.title}</h3>
            <p className="mt-3 text-sm leading-7 text-muted">{step.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

function FeaturesSection() {
  return (
    <SectionShell id="features" className="bg-slate-50/70">
      <SectionHeading
        centered
        title="Everything you need to drive performance"
        description="Built for modern marketing and growth teams that need creator operations, analytics, and commerce attribution in one place."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {features.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="rounded-[24px] p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </Card>
        ))}
      </div>
    </SectionShell>
  );
}

function AnalyticsSection() {
  return (
    <SectionShell id="analytics">
      <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          title="Know exactly which creator drives traffic, sales, and revenue"
          description="Use creator-level performance views with commerce metrics instead of relying on top-line engagement alone."
        />
        <div className="flex justify-start gap-4 lg:justify-end">
          <Card className="rounded-[22px] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">CVR</p>
            <p className="mt-2 text-2xl font-extrabold text-foreground">3.8%</p>
          </Card>
          <Card className="rounded-[22px] bg-primary/10 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">ROAS</p>
            <p className="mt-2 text-2xl font-extrabold text-primary-dark">8.2x</p>
          </Card>
        </div>
      </div>

      <Card className="mt-10 overflow-hidden rounded-[32px] p-0">
        <div className="grid grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] gap-3 border-b border-slate-100 px-6 py-4 text-xs font-extrabold uppercase tracking-[0.18em] text-muted">
          <span>Creator</span>
          <span>Clicks</span>
          <span>Orders</span>
          <span>Total Revenue</span>
          <span>ROAS</span>
        </div>
        <div className="divide-y divide-slate-100">
          {creatorRows.map((row, index) => (
            <div
              key={row.creator}
              className="grid grid-cols-[1.4fr_repeat(4,minmax(0,1fr))] items-center gap-3 px-6 py-5"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white ${
                    index % 2 === 0 ? "bg-slate-900" : "bg-primary-dark"
                  }`}
                >
                  {row.creator.split(" ").map((part) => part[0]).join("")}
                </div>
                <span className="font-bold text-foreground">{row.creator}</span>
              </div>
              <span className="font-medium text-muted">{row.clicks}</span>
              <span className="font-medium text-muted">{row.orders}</span>
              <span className="font-bold text-foreground">{row.revenue}</span>
              <span className="inline-flex w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary-dark">
                {row.roas}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </SectionShell>
  );
}

function AiSection() {
  return (
    <SectionShell id="ai-features" className="bg-[#eefbff]">
      <SectionHeading
        centered
        title="AI-powered creator campaign intelligence"
        description="Use predictive signals to match the right creators, forecast campaign efficiency, and catch fraud earlier."
      />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px] border-primary/10 bg-white/90 p-7">
          <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary-dark">
            AI Matching
          </div>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">
                Intelligent Creator Matching
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                Recommend creators based on product fit, audience overlap,
                revenue potential, and past performance signals instead of
                vanity metrics alone.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary-dark">
              <Bot className="h-7 w-7" />
            </div>
          </div>
        </Card>

        <Card className="rounded-[28px] border-[#ffd69b] bg-[#fff8ef] p-7">
          <div className="inline-flex rounded-full bg-[#ffe7bf] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#c57b00]">
            AI Forecasting
          </div>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">
                Predictive ROAS Forecasting
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                Model expected revenue, conversion rate, and campaign return
                before launch so budget goes to creators most likely to
                perform.
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#c57b00]">
              <TrendingUp className="h-7 w-7" />
            </div>
          </div>
        </Card>
      </div>
    </SectionShell>
  );
}

function IntegrationsSection() {
  return (
    <SectionShell id="integrations">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          title="Connected to the tools your growth team already uses"
          description="Keep campaign operations, store data, and marketing analytics aligned without building custom infrastructure first."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {integrations.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-white px-5 py-4 text-center text-sm font-bold text-foreground shadow-soft"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function FinalCtaSection() {
  return (
    <SectionShell className="pb-0">
      <div className="rounded-[36px] bg-primary px-6 py-16 text-center text-white shadow-hero sm:px-10 sm:py-20">
        <h2 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Move influencer marketing from views and likes to real commerce outcomes.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
          Join the teams using Creators Lab to launch campaigns, measure
          performance, and reward creators based on actual revenue impact.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-white px-7 text-primary-dark hover:bg-white/90"
          >
            Request Free Demo
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/70 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </SectionShell>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-white/80">
      <div className="container-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted">
              Creators Lab is an AI-powered, commerce-first influencer
              marketing platform built to track sales, measure ROI, and reward
              creator performance with confidence.
            </p>
          </div>

          {Object.entries(footerColumns).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-foreground">
                {title}
              </h3>
              <div className="mt-4 space-y-3">
                {links.map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="block text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Creators Lab. All rights reserved.</p>
          <p>Powered by The Marvel - Be You and Preneur Lab Limited</p>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <FeaturesSection />
      <AnalyticsSection />
      <AiSection />
      <IntegrationsSection />
      <FinalCtaSection />
      <Footer />
    </>
  );
}
