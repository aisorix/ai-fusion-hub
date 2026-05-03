import React, { useState } from "react";
import { PanelRightClose, PanelRight, ArrowLeft, Plug, Bot, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CommandCenter from "./CommandCenter";
import ConnectorPanel from "./ConnectorPanel";
import TaskMonitor from "./TaskMonitor";
import ApprovalModal from "./ApprovalModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";

interface CoWorkLayoutProps {
  language: string;
}

const CoWorkLayout: React.FC<CoWorkLayoutProps> = ({ language }) => {
  const [showMonitor, setShowMonitor] = useState(true);
  const [showMobileConnectors, setShowMobileConnectors] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/chat")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Sorix Agent</h1>
              <p className="text-[10px] text-muted-foreground">Your Tasks, Handled by Intelligence.</p>
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Command Center */}
        <div className={cn("flex-1 min-w-0", !showMonitor && "w-full")}>
          <CommandCenter language={language} />
        </div>

        {/* Task Monitor - right panel (desktop) */}
        {showMonitor && !isMobile && (
          <div className="w-72 xl:w-80 shrink-0">
            <TaskMonitor language={language} />
          </div>
        )}
      </div>

      {/* Mobile Connectors Bottom Sheet */}
      <AnimatePresence>
        {isMobile && showMobileConnectors && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowMobileConnectors(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] z-50 rounded-t-3xl border-t border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 shrink-0">
                <div className="flex items-center gap-2">
                  <Plug className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold">
                    {language === "bn" ? "কানেক্টর" : "Connectors"}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowMobileConnectors(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <ConnectorPanel language={language} />
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Approval Modal */}
      <ApprovalModal language={language} />
    </div>
  );
};

export default CoWorkLayout;
