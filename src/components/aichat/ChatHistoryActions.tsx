import { MoreHorizontal, Pencil, Star, StarOff, Trash2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHistoryActionsProps {
  chatId: string;
  isStarred?: boolean;
  onDelete: (id: string) => void;
  onRenameRequest: () => void;
  onToggleStar: (id: string) => void;
}

const ChatHistoryActions = ({
  chatId,
  isStarred = false,
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
          className="p-1 rounded-md shrink-0 hover:bg-muted/80 transition-colors text-muted-foreground"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} className="w-44 bg-popover border border-border shadow-lg z-50">
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