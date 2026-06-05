import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, LogIn, UserPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const GuestLimitModal = ({
  isOpen,
  onClose,
  title = "You've used your free messages",
  description = "Create a free account to keep chatting, save your history, and unlock more tools.",
}: GuestLimitModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = encodeURIComponent(location.pathname + location.search);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-[300]">
        <DialogHeader className="text-center items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mb-3 shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 mt-4">
          <Button
            onClick={() => navigate(`/register?redirect=${redirect}`)}
            className="h-11 bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-primary-foreground font-semibold gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Create free account
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/login?redirect=${redirect}`)}
            className="h-11 gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign in
          </Button>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground mt-2"
          >
            Not now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLimitModal;
