import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, subtitle, action, children, className }: Props) {
  return (
    <Card className={cn("p-4 sm:p-5 bg-card border-border w-full", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground break-words">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="w-full overflow-x-auto">{children}</div>
    </Card>
  );
}
