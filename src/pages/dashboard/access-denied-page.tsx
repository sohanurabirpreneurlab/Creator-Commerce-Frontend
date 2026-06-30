import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AccessDeniedPage() {
  return (
    <Card className="p-8">
      <div className="flex max-w-3xl flex-col gap-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-rose-100 text-rose-500">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Access Denied
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
            You do not have permission to view this dashboard page.
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            The current role does not have UI access to this route. Backend APIs
            still need to enforce the real authorization rules independently.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/dashboard/overview">
            <Button>Return to Overview</Button>
          </Link>
          <Link to="/">
            <Button variant="outline">Back to Landing Page</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
