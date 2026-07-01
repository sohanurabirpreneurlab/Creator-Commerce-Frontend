import { Card } from "@/components/ui/card";

export function DataTableEmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-8">
      <h2 className="text-xl font-extrabold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
    </Card>
  );
}
