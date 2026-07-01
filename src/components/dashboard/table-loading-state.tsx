import { LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TableLoadingState({ message }: { message: string }) {
  return (
    <Card className="p-8">
      <div className="flex items-center gap-3 text-slate-600">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </Card>
  );
}
