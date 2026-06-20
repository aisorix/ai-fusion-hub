import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ImageIcon, Video, ExternalLink, Loader2 } from "lucide-react";

type Kind = "image" | "video";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  kind?: Kind;
  /** required=true marks empty as error; default false (empty allowed) */
  required?: boolean;
}

const IMG_EXT = /\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i;
const VID_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function parseUrl(raw: string): URL | null {
  const v = raw.trim();
  if (!v) return null;
  try {
    const u = new URL(v);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u;
  } catch { return null; }
}

function youtubeId(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") return u.pathname.slice(1) || null;
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    if (u.pathname === "/watch") return u.searchParams.get("v");
    const m = u.pathname.match(/^\/(embed|shorts|v)\/([\w-]{6,})/);
    if (m) return m[2];
  }
  return null;
}

function vimeoId(u: URL): string | null {
  if (!u.hostname.includes("vimeo.com")) return null;
  const m = u.pathname.match(/\/(\d{6,})/);
  return m ? m[1] : null;
}

export function MediaUrlField({ label, value, onChange, placeholder, kind = "image", required }: Props) {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const url = parseUrl(value);
  const trimmed = value.trim();

  // Classify
  let preview: { type: "img" | "video" | "iframe"; src: string; href: string } | null = null;
  let typeWarning: string | null = null;

  if (url) {
    if (kind === "image") {
      if (IMG_EXT.test(url.pathname) || url.hostname.includes("googleusercontent") || url.hostname.includes("unsplash") || url.hostname.includes("cloudinary") || url.hostname.includes("imgur") || url.hostname.includes("supabase")) {
        preview = { type: "img", src: url.toString(), href: url.toString() };
      } else {
        preview = { type: "img", src: url.toString(), href: url.toString() };
        typeWarning = "URL has no image extension — preview may fail.";
      }
    } else {
      const yt = youtubeId(url);
      const vm = vimeoId(url);
      if (yt) {
        preview = { type: "iframe", src: `https://www.youtube.com/embed/${yt}`, href: `https://youtu.be/${yt}` };
      } else if (vm) {
        preview = { type: "iframe", src: `https://player.vimeo.com/video/${vm}`, href: `https://vimeo.com/${vm}` };
      } else if (VID_EXT.test(url.pathname)) {
        preview = { type: "video", src: url.toString(), href: url.toString() };
      } else {
        typeWarning = "Unsupported video host. Use YouTube, Vimeo, or a direct mp4/webm link.";
      }
    }
  }

  useEffect(() => {
    setLoadState(preview ? "loading" : "idle");
  }, [preview?.src]);

  const showRequiredError = required && !trimmed;
  const showFormatError = trimmed && !url;
  const Icon = kind === "image" ? ImageIcon : Video;

  return (
    <div>
      <Label className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (kind === "image" ? "https://...jpg" : "https://youtube.com/...")}
          className={showFormatError || showRequiredError ? "border-destructive pr-9" : "pr-9"}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {showFormatError || showRequiredError ? (
            <AlertCircle className="w-4 h-4 text-destructive" />
          ) : url && loadState === "ok" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : url && loadState === "loading" ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : url && loadState === "error" ? (
            <AlertCircle className="w-4 h-4 text-amber-500" />
          ) : null}
        </div>
      </div>

      {showRequiredError && <p className="mt-1 text-xs text-destructive">Required.</p>}
      {showFormatError && <p className="mt-1 text-xs text-destructive">Enter a valid https:// URL.</p>}
      {!showFormatError && typeWarning && <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">{typeWarning}</p>}

      {preview && (
        <div className="mt-2 rounded-lg border border-border overflow-hidden bg-muted/30">
          {preview.type === "img" && (
            <div className="relative">
              <img
                src={preview.src}
                alt=""
                loading="lazy"
                className="w-full max-h-56 object-cover bg-background"
                onLoad={() => setLoadState("ok")}
                onError={() => setLoadState("error")}
              />
              {loadState === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 text-xs text-destructive gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Image failed to load
                </div>
              )}
            </div>
          )}
          {preview.type === "video" && (
            <video
              src={preview.src}
              controls
              preload="metadata"
              className="w-full max-h-56 bg-black"
              onLoadedMetadata={() => setLoadState("ok")}
              onError={() => setLoadState("error")}
            />
          )}
          {preview.type === "iframe" && (
            <div className="aspect-video">
              <iframe
                src={preview.src}
                title="preview"
                className="w-full h-full"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoadState("ok")}
              />
            </div>
          )}
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px] text-muted-foreground border-t border-border">
            <span className="truncate">{url?.hostname}</span>
            <a href={preview.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUrlField;
