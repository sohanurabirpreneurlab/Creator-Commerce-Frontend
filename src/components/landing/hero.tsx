import {
  ArrowRight,
  MousePointerClick,
  MoveUpRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const avatars = [
  "AB",
  "CM",
  "JR",
  "LK",
];

const performanceCards = [
  {
    label: "Active Campaign Revenue",
    value: "$1,850,000",
    change: "+18.4%",
  },
  {
    label: "Unique Clicks",
    value: "24,500",
  },
  {
    label: "Conversions",
    value: "18,200",
  },
  {
    label: "ROAS Lift",
    value: "620",
  },
];

const creatorRows = [
  {
    name: "Creator A",
    channel: "TikTok Commerce",
    sales: "$72,400",
    lift: "+4.2x",
  },
  {
    name: "Creator B",
    channel: "YouTube Shorts",
    sales: "$39,100",
    lift: "Top ROI",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-14 pt-8 sm:pb-18 sm:pt-12 lg:pb-20 lg:pt-14">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-grid bg-[size:48px_48px] opacity-40" />
      <div className="container-shell">
        <div className="grid items-center gap-10 md:flex xl:items-center xl:gap-12">
          <div className="max-w-2xl  md:w-[30%] xl:w-[50%] ">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-dark sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.24em]">
              <Sparkles className="h-3.5 w-3.5" />
              Commerce-first influencer platform
            </div>

            <h1 className="mt-5 max-w-xl text-[2.8rem] font-extrabold leading-[0.98] tracking-tight text-foreground sm:text-[3.4rem] md:max-w-2xl md:text-[2.8rem] lg:text-[2.2rem] xl:text-[3.5rem]">
              Influencer
              <br />
              Marketing Built for
              <br />
              <span className="text-primary">Real Commerce</span>
              <br />
              Outcomes
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg md:max-w-2xl md:text-[1.05rem]">
              Stop guessing who’s driving revenue. The only platform that
              connects influencer activity to unique links, sales, and true
              ROI with AI-powered attribution.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-6 md:px-7">
                Request Demo
                <ArrowRight className="h-4 w-4" />
              </Button>
              {/* <Button variant="outline" size="lg" className="gap-2 px-6 md:px-7">
                See How It Works
                <ChevronRight className="h-4 w-4" />
              </Button> */}
            </div>

            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex -space-x-3">
                {avatars.map((avatar, index) => (
                  <div
                    key={avatar}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-lg sm:h-11 sm:w-11"
                    style={{
                      background:
                        index % 2 === 0
                          ? "linear-gradient(135deg, #17c6ee, #0b8fb0)"
                          : "linear-gradient(135deg, #1f2937, #4b5563)",
                    }}
                  >
                    {avatar}
                  </div>
                ))}
              </div>
              {/* <div className="flex items-center gap-3 text-sm text-muted">
                <BadgeCheck className="h-5 w-5 text-primary" />
                <span>
                  Trusted by fast-growing DTC brands and creator-led commerce
                  teams.
                </span>
              </div> */}
            </div>
          </div>

          <div className="relative mx-auto w-[60%] max-w-4xl xl:mx-0 xl:max-w-none xl:basis-[58%] xl:flex-[1.1]">
            <div className="absolute -right-3 top-10 hidden rounded-2xl bg-accent-yellow px-3 py-2.5 shadow-soft lg:block xl:-right-6 xl:top-14 xl:px-4 xl:py-3">
              <ShoppingBag className="h-5 w-5 text-foreground xl:h-6 xl:w-6" />
            </div>
            <div className="absolute -left-3 bottom-10 hidden rounded-2xl bg-white px-3 py-2.5 shadow-soft lg:block xl:-left-6 xl:bottom-14 xl:px-4 xl:py-3">
              <MousePointerClick className="h-5 w-5 text-primary xl:h-6 xl:w-6" />
            </div>

            <Card className="relative overflow-hidden border-primary/10 bg-white/90 p-4 shadow-hero backdrop-blur md:p-5 lg:p-6">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary-dark to-accent-yellow" />

              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[22px] border border-slate-100 bg-white p-4 md:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                        Active GMV tracked
                      </p>
                      <p className="mt-3 text-[1.9rem] font-extrabold tracking-tight text-foreground sm:text-[2.2rem] lg:text-[1.5rem]">
                        $1,850,000
                      </p>
                    </div>
                    <div className="rounded-full bg-accent-peach px-3 py-1 text-xs font-bold text-[#cb7b00]">
                      +18.4%
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {performanceCards.slice(1).map((card) => (
                      <div
                        key={card.label}
                        className="rounded-2xl bg-slate-50 p-3"
                      >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                          {card.label}
                        </p>
                        <p className="mt-2 text-base font-extrabold text-foreground sm:text-lg">
                          {card.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[22px] bg-primary/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      Conversion Lift
                    </p>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-3xl font-extrabold text-primary-dark sm:text-4xl">
                        6.5x
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-dark">
                        AI forecast
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
                    <div className="space-y-3">
                      {creatorRows.map((row) => (
                        <div
                          key={row.name}
                          className="flex items-center gap-3 rounded-2xl bg-white p-3"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white sm:h-11 sm:w-11 sm:text-xs">
                            {row.name.split(" ").map((part) => part[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-foreground sm:text-base">
                              {row.name}
                            </p>
                            <p className="truncate text-xs text-muted sm:text-sm">
                              {row.channel}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground sm:text-base">
                              {row.sales}
                            </p>
                            <p className="text-xs font-semibold text-primary-dark sm:text-sm">
                              {row.lift}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-4 rounded-[22px] bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    Campaign Performance
                  </p>
                  <p className="mt-2 text-xl font-extrabold text-foreground sm:text-2xl">
                    Track creators against revenue, not vanity metrics
                  </p>
                </div>
                <Button size="lg" className="gap-2 self-start px-5 sm:self-auto">
                  Live dashboard preview
                  <MoveUpRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
