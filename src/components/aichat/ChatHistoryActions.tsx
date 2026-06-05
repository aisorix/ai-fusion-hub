import { MoreHorizontal, Pencil, Star, StarOff, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatHistoryActionsProps {
  chatId: string;
  isStarred?: boolean;
  isActive?: boolean;
  onDelete: (id: string) => void;
  onRenameRequest: () => void;
  onToggleStar: (id: string) => void;
}

const ChatHistoryActions = ({
  chatId,
  isStarred = false,
  isActive = false,
  onDelete,
  onRenameRequest,
  onToggleStar,
}: ChatHistoryActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Chat actions"
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "h-7 w-7 inline-flex items-center justify-center rounded-md shrink-0 transition-colors",
            "hover:bg-muted/80 active:bg-muted",
            isActive ? "text-primary/80 hover:text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-44 bg-popover border border-border shadow-lg z-[100]">
        <DropdownMenuItem onSelect={() => onToggleStar(chatId)}>
          {isStarred ? (
            <>
              <StarOff className="w-3.5 h-3.5 mr-2" />
              Unstar
            </>
          ) : (
            <>
              <Star className="w-3.5 h-3.5 mr-2" />
              Star
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onRenameRequest}>
          <Pencil className="w-3.5 h-3.5 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => onDelete(chatId)} className="text-destructive focus:text-destructive">
          <Trash2 className="w-3.5 h-3.5 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChatHistoryActions;
