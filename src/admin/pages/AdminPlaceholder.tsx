import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function AdminPlaceholder({ title, week }: { title: string; week: number }) {
  return (
    <Card className="p-12 flex flex-col items-center justify-center text-center gap-3 border-dashed">
      <Construction className="w-10 h-10 text-amber-500" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm text-slate-500 max-w-md">
        Coming in Week {week} of the build. The route is wired so navigation works end-to-end; the full UI ships in the next development loop.
      </p>
    </Card>
  );
}
