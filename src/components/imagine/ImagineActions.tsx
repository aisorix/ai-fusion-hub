import React, { useState } from 'react';
import { Download, Share2, Copy, Check, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Props {
  imageUrl: string;
  prompt: string;
  onGenerateVideo?: () => void;
}

const downloadImage = async (imageUrl: string, format: string, prompt: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    const objectUrl = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      const mimeType = format === 'jpg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob((finalBlob) => {
        if (!finalBlob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(finalBlob);
        a.download = `sorix-imagine-${Date.now()}.${format}`;
        a.click();
        URL.revokeObjectURL(a.href);
        toast.success(`Downloaded as ${format.toUpperCase()}`);
      }, mimeType, 0.95);
      
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  } catch {
    // Fallback: direct download
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `sorix-imagine-${Date.now()}.png`;
    a.click();
    toast.success('Downloaded');
  }
};

const ImagineActions: React.FC<Props> = ({ imageUrl, prompt, onGenerateVideo }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      toast.success('Image copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: copy URL
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast.success('Image URL copied');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sorix Imagine',
          text: prompt,
          url: imageUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(imageUrl);
      toast.success('Image link copied');
    }
  };

  return (
    <div className="flex items-center justify-center sm:justify-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide px-1 -mx-1 sm:flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-popover border border-border">
          <DropdownMenuItem onClick={() => downloadImage(imageUrl, 'png', prompt)}>
            PNG (Lossless)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadImage(imageUrl, 'jpg', prompt)}>
            JPG (Compressed)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadImage(imageUrl, 'webp', prompt)}>
            WebP (Modern)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={handleShare}>
        <Share2 className="w-3.5 h-3.5" />
        Share
      </Button>

      <Button variant="outline" size="sm" className="gap-1.5 rounded-xl" onClick={handleCopy}>
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        {copied ? 'Copied' : 'Copy'}
      </Button>

      {onGenerateVideo && (
        <Button
          size="sm"
          onClick={onGenerateVideo}
          className="gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white hover:opacity-90 border-0 shadow-md shadow-fuchsia-500/30"
        >
          <Clapperboard className="w-3.5 h-3.5" />
          Generate Video
        </Button>
      )}
    </div>
  );
};

export default ImagineActions;
