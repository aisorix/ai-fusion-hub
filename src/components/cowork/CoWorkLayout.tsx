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
    <div className="h-[100dvh] flex flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 border-b border-border/40 bg-background/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-muted/60"
            onClick={() => navigate("/chat")}
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md shadow-cyan-500/15">
              <Bot className="w-[18px] h-[18px] text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">Sorix Agent</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">
                {language === "bn" ? "আপনার কাজ, বুদ্ধিমত্তার হাতে।" : "Your Tasks, Handled by Intelligence."}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {isMobile ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted/60"
              onClick={() => setShowMobileConnectors(true)}
            >
              <Plug className="w-4.5 h-4.5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted/60"
              onClick={() => setShowMonitor(!showMonitor)}
              title={showMonitor ? "Hide panel" : "Show panel"}
            >
              {showMonitor ? <PanelRightClose className="w-4.5 h-4.5" /> : <PanelRight className="w-4.5 h-4.5" />}
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
        {/* Command Center */}
        <div className={cn("flex-1 min-w-0 min-h-0")}>
          <CommandCenter language={language} />
        </div>

        {/* Task Monitor + Connectors - right panel (desktop) */}
        <AnimatePresence>
          {showMonitor && !isMobile && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 304, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="shrink-0 overflow-hidden"
            >
              <div className="w-[304px] h-full">
                <TaskMonitor language={language} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Connectors Modal */}
      <AnimatePresence>
        {isMobile && showMobileConnectors && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              onClick={() => setShowMobileConnectors(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 max-h-[75vh] z-50 rounded-t-3xl border-t border-border/40 bg-background shadow-2xl overflow-hidden"
            >
              <div className="w-12 h-1 bg-muted-foreground/20 rounded-full mx-auto mt-2.5 mb-1" />
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Plug className="w-4 h-4 text-cyan-500" />
                  </div>
                  <h3 className="text-sm font-semibold">
                    {language === "bn" ? "কানেক্টর" : "Connectors"}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setShowMobileConnectors(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[calc(75vh-80px)] p-4">
                <ConnectorPanel language={language} />
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
