import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  APPLIED: "bg-sky-50 text-sky-700",
  APPROVED: "bg-emerald-50 text-emerald-700",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  VERIFIED: "bg-emerald-50 text-emerald-700",
  SUBMITTED: "bg-sky-50 text-sky-700",
  DRAFT: "bg-slate-100 text-slate-700",
  PENDING: "bg-amber-50 text-amber-700",
  CHANGE_REQUESTED: "bg-amber-50 text-amber-700",
  REJECTED: "bg-rose-50 text-rose-700",
  WITHDRAWN: "bg-slate-100 text-slate-600",
  DEACTIVATED: "bg-rose-50 text-rose-700",
  EXPIRED: "bg-amber-50 text-amber-700",
  INACTIVE: "bg-slate-100 text-slate-600",
  PAUSED: "bg-amber-50 text-amber-700",
  REMOVED: "bg-slate-100 text-slate-600",
  SUSPENDED: "bg-rose-50 text-rose-700",
  DISABLED: "bg-rose-50 text-rose-700",
  CANCELLED: "bg-slate-100 text-slate-700",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]",
        statusClasses[status] ?? "bg-slate-100 text-slate-700",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
