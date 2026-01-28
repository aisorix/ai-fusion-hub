import React, { useState, memo } from 'react';
import { 
  Copy, 
  Check, 
  Share2, 
  Volume2, 
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatStore, Message, Attachment } from '@/stores/chatStore';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { MarkdownRenderer } from './MarkdownRenderer';
import { cn } from '@/lib/utils';
import copy from 'copy-to-clipboard';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
}

export const MessageBubble = memo(({ message, isLast }: MessageBubbleProps) => {
  const { openShareModal } = useChatStore();
  const { speak, stop, isSpeaking: speaking, isSupported: supported } = useSpeechSynthesis();
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    copy(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (speaking) {
      stop();
    } else {
      speak(message.content);
    }
  };

  const handleShare = () => {
    openShareModal(message.id);
  };

  const handleReaction = (type: 'up' | 'down') => {
    setReaction(reaction === type ? null : type);
  };

  return (
    <div
      className={cn(
        'group flex gap-3 py-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar for Assistant */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-sm font-semibold">S</span>
        </div>
      )}

      <div className={cn('max-w-[85%] flex flex-col', isUser && 'items-end')}>
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3',
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted rounded-bl-sm'
          )}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.citations.map((citation, index) => (
              <a
                key={index}
                href={citation}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full"
              >
                <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                  {index + 1}
                </span>
                {new URL(citation).hostname}
              </a>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>

            {supported && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleSpeak}
              >
                {speaking ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleReaction('up')}
            >
              <ThumbsUp
                className={cn(
                  'h-3.5 w-3.5',
                  reaction === 'up' && 'fill-current text-green-500'
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleReaction('down')}
            >
              <ThumbsDown
                className={cn(
                  'h-3.5 w-3.5',
                  reaction === 'down' && 'fill-current text-red-500'
                )}
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Regenerate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Avatar for User */}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-semibold">U</span>
        </div>
      )}
    </div>
  );
});

const AttachmentPreview = memo(({ attachment }: { attachment: Attachment }) => {
  if (attachment.type === 'image') {
    return (
      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
        <img
          src={attachment.url}
          alt={attachment.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm">
      <Download className="h-4 w-4 text-muted-foreground" />
      <span className="truncate max-w-[120px]">{attachment.name}</span>
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
AttachmentPreview.displayName = 'AttachmentPreview';
