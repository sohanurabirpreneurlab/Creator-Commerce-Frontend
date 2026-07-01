import { Card } from "@/components/ui/card";
import type { ProfileCompletion } from "@/types/profile";

export function ProfileCompletionCard({
  completion,
}: {
  completion: ProfileCompletion;
}) {
  return (
    <Card className="p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Profile Completion
          </p>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
            {completion.percentage}%
          </h2>
          <p className="mt-2 text-sm text-muted">
            {completion.completedFields} of {completion.totalFields} fields
            completed
          </p>
        </div>

        <div className="flex-1 lg:max-w-xl">
          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#0f766e_0%,#14b8a6_52%,#67e8f9_100%)] transition-all duration-300"
              style={{ width: `${completion.percentage}%` }}
            />
          </div>

          {completion.missingFields.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              Your profile is complete.
            </p>
          ) : (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Missing
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {completion.missingFields.map((field) => (
                  <li
                    key={field}
                    className="rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow-sm"
                  >
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
