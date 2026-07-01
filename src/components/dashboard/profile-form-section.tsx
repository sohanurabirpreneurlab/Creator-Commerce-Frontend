import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function ProfileFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-7">
      <div className="max-w-3xl">
        <h3 className="text-xl font-extrabold tracking-tight text-foreground">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
        ) : null}
      </div>

      <div className="mt-6">{children}</div>
    </Card>
  );
}
