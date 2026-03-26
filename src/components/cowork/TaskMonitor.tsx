import React from "react";
import { Sparkles, Inbox } from "lucide-react";
import { useCoWorkStore } from "@/stores/coworkStore";
import TaskCard from "./TaskCard";
import ConnectorPanel from "./ConnectorPanel";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskMonitorProps {
  language: string;
}

const TaskMonitor: React.FC<TaskMonitorProps> = ({ language }) => {
  const { tasks } = useCoWorkStore();

  return (
    <div className="h-full flex flex-col border-l border-border/40 bg-muted/10">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h3 className="text-sm font-semibold">
            {language === "bn" ? "টাস্ক মনিটর" : "Task Monitor"}
          </h3>
          {tasks.length > 0 && (
            <span className="ml-auto text-[10px] font-semibold bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded-full">
              {tasks.length}
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Active Tasks */}
          {tasks.length > 0 ? (
            <div className="space-y-2.5">
              <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold px-1">
                {language === "bn" ? "সক্রিয় টাস্ক" : "Active Tasks"}
              </h4>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} language={language} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
                <Inbox className="w-7 h-7 text-muted-foreground/25" />
              </div>
              <p className="text-xs text-muted-foreground/50 font-medium">
                {language === "bn" ? "কোনো সক্রিয় টাস্ক নেই" : "No active tasks"}
              </p>
              <p className="text-[10px] text-muted-foreground/30 mt-0.5">
                {language === "bn" ? "টাস্ক দিন, এখানে ট্র্যাক হবে" : "Tasks will appear here"}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-border/30" />

          {/* Connectors */}
          <ConnectorPanel language={language} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskMonitor;
