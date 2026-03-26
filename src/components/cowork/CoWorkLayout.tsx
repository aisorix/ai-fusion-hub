import React, { useState } from "react";
import { PanelRightClose, PanelRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommandCenter from "./CommandCenter";
import TaskMonitor from "./TaskMonitor";
import ApprovalModal from "./ApprovalModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoWorkLayoutProps {
  language: string;
}

const CoWorkLayout: React.FC<CoWorkLayoutProps> = ({ language }) => {
  const [showMonitor, setShowMonitor] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/chat")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">CO</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Sorix Co-Work</h1>
              <p className="text-[10px] text-muted-foreground">AI Agent Workspace</p>
            </div>
          </div>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowMonitor(!showMonitor)}
          >
            {showMonitor ? <PanelRightClose className="w-4 h-4" /> : <PanelRight className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Command Center */}
        <div className={cn("flex-1 min-w-0", !showMonitor && "w-full")}>
          <CommandCenter language={language} />
        </div>

        {/* Task Monitor - right panel */}
        {showMonitor && !isMobile && (
          <div className="w-72 xl:w-80 shrink-0">
            <TaskMonitor language={language} />
          </div>
        )}
      </div>

      {/* Mobile bottom sheet for task monitor */}
      {isMobile && (
        <MobileTaskToggle language={language} />
      )}

      {/* Approval Modal */}
      <ApprovalModal language={language} />
    </div>
  );
};

const MobileTaskToggle: React.FC<{ language: string }> = () => {
  return null; // Tasks show inline on mobile in phase 1
};

export default CoWorkLayout;
