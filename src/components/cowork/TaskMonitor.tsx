import React from "react";
import { Activity, Trash2 } from "lucide-react";
import { useCoWorkStore } from "@/stores/coworkStore";
import TaskCard from "./TaskCard";

import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskMonitorProps {
  language: string;
}

const TaskMonitor: React.FC<TaskMonitorProps> = ({ language }) => {
  const { tasks, removeTask } = useCoWorkStore();

  return (
    <div className="h-full flex flex-col border-l border-border/30 bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold">
            {language === "bn" ? "টাস্ক মনিটর" : "Task Monitor"}
          </h3>
          {tasks.length > 0 && (
            <span className="ml-auto text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded-full">
              {tasks.length}
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Active Tasks */}
          {tasks.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1">
                {language === "bn" ? "সক্রিয় টাস্ক" : "Active Tasks"}
              </h4>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} language={language} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-8 h-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/50">
                {language === "bn" ? "কোনো সক্রিয় টাস্ক নেই" : "No active tasks"}
              </p>
            </div>
          )}

        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskMonitor;
