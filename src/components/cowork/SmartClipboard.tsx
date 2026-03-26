import React, { useState } from "react";
import { ClipboardCopy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SmartClipboardProps {
  content: string;
  language: string;
}

const SmartClipboard: React.FC<SmartClipboardProps> = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(language === "bn" ? "কপি হয়েছে!" : "Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="h-7 text-xs gap-1.5 border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            {language === "bn" ? "কপি হয়েছে" : "Copied"}
          </>
        ) : (
          <>
            <ClipboardCopy className="w-3 h-3" />
            {language === "bn" ? "কপি করুন" : "Format & Copy"}
          </>
        )}
      </Button>
    </div>
  );
};

export default SmartClipboard;
