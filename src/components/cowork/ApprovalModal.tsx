import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ShieldAlert, Pencil } from "lucide-react";
import { useCoWorkStore } from "@/stores/coworkStore";

interface ApprovalModalProps {
  language: string;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ language }) => {
  const { approvalRequest, setApprovalRequest } = useCoWorkStore();
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  if (!approvalRequest) return null;

  const handleApprove = () => {
    // TODO: Send approval to agent
    setApprovalRequest(null);
  };

  const handleEdit = () => {
    setEditedContent(approvalRequest.content);
    setEditing(true);
  };

  const handleCancel = () => {
    setApprovalRequest(null);
    setEditing(false);
  };

  return (
    <Dialog open={!!approvalRequest} onOpenChange={() => handleCancel()}>
      <DialogContent className="sm:max-w-lg border-amber-500/30 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
            {language === "bn" ? "অনুমোদন প্রয়োজন" : "Action Approval Required"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{approvalRequest.description}</p>

          <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground mb-1 font-medium">
              {language === "bn" ? "প্রস্তাবিত অ্যাকশন" : "Proposed Action"}
            </p>
            {editing ? (
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] text-sm"
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{approvalRequest.content}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            {language === "bn" ? "বাতিল" : "Cancel"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit} className="gap-1">
            <Pencil className="w-3.5 h-3.5" />
            {language === "bn" ? "সম্পাদনা" : "Edit"}
          </Button>
          <Button
            size="sm"
            onClick={handleApprove}
            className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white"
          >
            {language === "bn" ? "অনুমোদন" : "Approve"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalModal;
