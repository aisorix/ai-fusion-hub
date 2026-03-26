import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { CoWorkTask, TaskStep } from "@/stores/coworkStore";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: CoWorkTask;
  language: string;
}

const stepIcon = (status: TaskStep["status"]) => {
  switch (status) {
    case "done": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    case "running": return <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />;
    case "error": return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    default: return <Circle className="w-3.5 h-3.5 text-muted-foreground/40" />;
  }
};

const statusColor: Record<string, string> = {
  pending: "text-muted-foreground",
  running: "text-cyan-400",
  blocked: "text-amber-400",
  completed: "text-emerald-400",
  failed: "text-red-400",
};

const TaskCard: React.FC<TaskCardProps> = ({ task, language }) => {
  const [expanded, setExpanded] = React.useState(task.status === "running");

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {task.status === "running" ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
          ) : task.status === "completed" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <span className="text-xs font-medium truncate">{task.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn("text-[10px] font-medium uppercase", statusColor[task.status])}>
            {task.status}
          </span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {expanded && task.steps.length > 0 && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="border-t border-border/30 px-3 py-2 space-y-1.5"
        >
          {task.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              {stepIcon(step.status)}
              <span className={cn("text-xs", step.status === "done" ? "text-foreground/70" : "text-foreground")}>
                {step.label}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default TaskCard;
