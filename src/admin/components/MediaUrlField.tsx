import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertCircle, CheckCircle2, ImageIcon, Video, ExternalLink, Loader2,
  Upload, X, RotateCcw, WifiOff, Lock, FileWarning, ServerCrash,
} from "lucide-react";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;

type UploadErrorKind = "none" | "file_size" | "file_type" | "auth" | "network" | "server" | "bucket" | "aborted" | "unknown";

type Kind = "image" | "video";

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  kind?: Kind;
  required?: boolean;
  /** Folder prefix inside the scholars-media bucket, e.g. "courses/banners". */
  uploadFolder?: string;
  /** Disable the drag-and-drop uploader; URL-only field. */
  disableUpload?: boolean;
}

const BUCKET = "scholars-media";
const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 200;

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
function safeName(name: string) {
  return name.toLowerCase().replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-").slice(-80);
}
function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function MediaUrlField({
  label, value, onChange, placeholder, kind = "image", required,
  uploadFolder = "misc", disableUpload = false,
}: Props) {
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bytes, setBytes] = useState<{ loaded: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadErrorKind, setUploadErrorKind] = useState<UploadErrorKind>("none");
  const [lastFile, setLastFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);


  const url = parseUrl(value);
  const trimmed = value.trim();

  let preview: { type: "img" | "video" | "iframe"; src: string; href: string } | null = null;
  let typeWarning: string | null = null;
  let sourceLabel: string | null = null;

  if (url) {
    if (kind === "image") {
      preview = { type: "img", src: url.toString(), href: url.toString() };
      const isUploaded = /scholars-media/.test(url.pathname + url.hostname);
      sourceLabel = isUploaded ? "Uploaded file" : url.hostname.replace(/^www\./, "");
      if (!IMG_EXT.test(url.pathname) && !/scholars-media|googleusercontent|unsplash|cloudinary|imgur|supabase/.test(url.hostname + url.pathname)) {
        typeWarning = "URL has no image extension — preview may fail.";
      }
    } else {
      const yt = youtubeId(url);
      const vm = vimeoId(url);
      if (yt) { preview = { type: "iframe", src: `https://www.youtube.com/embed/${yt}`, href: `https://youtu.be/${yt}` }; sourceLabel = "YouTube"; }
      else if (vm) { preview = { type: "iframe", src: `https://player.vimeo.com/video/${vm}`, href: `https://vimeo.com/${vm}` }; sourceLabel = "Vimeo"; }
      else if (VID_EXT.test(url.pathname)) {
        preview = { type: "video", src: url.toString(), href: url.toString() };
        sourceLabel = /scholars-media/.test(url.pathname + url.hostname) ? "Uploaded video" : "Direct video";
      }
      else typeWarning = "Unsupported video host. Use YouTube, Vimeo, or a direct mp4/webm link.";
    }
  }

  useEffect(() => { setLoadState(preview ? "loading" : "idle"); }, [preview?.src]);

  const showRequiredError = required && !trimmed;
  const showFormatError = trimmed && !url;
  const Icon = kind === "image" ? ImageIcon : Video;

  const acceptAttr = kind === "image"
    ? "image/png,image/jpeg,image/webp,image/gif,image/avif"
    : "video/mp4,video/webm,video/quicktime";

  const validateFile = (file: File): string | null => {
    const maxMb = kind === "image" ? MAX_IMAGE_MB : MAX_VIDEO_MB;
    if (file.size > maxMb * 1024 * 1024) return `File exceeds ${maxMb} MB limit`;
    if (kind === "image" && !/^image\//.test(file.type)) return "Not an image file";
    if (kind === "video" && !/^video\//.test(file.type)) return "Not a video file";
    return null;
  };

  const upload = async (file: File) => {
    const err = validateFile(file);
    if (err) {
      if (err.includes("exceeds")) {
        setUploadErrorKind("file_size");
        setUploadError(err);
      } else {
        setUploadErrorKind("file_type");
        setUploadError(err);
      }
      toast.error(err);
      return;
    }
    setLastFile(file);
    setUploadError(null);
    setUploadErrorKind("none");
    setUploading(true);
    setProgress(0);
    setBytes({ loaded: 0, total: file.size });

    let path: string;
    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error("Not signed in");
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      path = `${uploadFolder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
      const endpoint = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`;

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open("POST", endpoint, true);
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        xhr.setRequestHeader("x-upsert", "false");
        xhr.setRequestHeader("Cache-Control", "max-age=31536000");
        if (file.type) xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setBytes({ loaded: e.loaded, total: e.total });
            setProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            let msg = `Upload failed (${xhr.status})`;
            try { const j = JSON.parse(xhr.responseText); if (j?.message) msg = j.message; } catch {}
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.onabort = () => reject(new Error("__aborted__"));
        xhr.send(file);
      });

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (!pub?.publicUrl) throw new Error("Could not resolve URL");
      onChange(pub.publicUrl);
      setProgress(100);
      toast.success("Uploaded");
    } catch (e: any) {
      const rawMsg = (e?.message || "Upload failed").toString();
      if (rawMsg === "__aborted__") {
        setUploadErrorKind("aborted");
        setUploadError("Upload was cancelled");
      } else if (rawMsg.includes("Not signed in") || rawMsg.includes("Unauthorized") || rawMsg.includes("JWT") || rawMsg.includes("auth")) {
        setUploadErrorKind("auth");
        setUploadError("Authentication failed. Please sign in again.");
      } else if (rawMsg.includes("Bucket") || rawMsg.includes("bucket") || rawMsg.includes("not found") || rawMsg.includes("resource")) {
        setUploadErrorKind("bucket");
        setUploadError("Storage bucket not found or not accessible.");
      } else if (rawMsg.includes("Network") || rawMsg.includes("Failed to fetch") || rawMsg.includes("net::")) {
        setUploadErrorKind("network");
        setUploadError("Network error. Check your connection and try again.");
      } else if (rawMsg.includes("size") || rawMsg.includes("large") || rawMsg.includes("too big") || rawMsg.includes("Payload")) {
        setUploadErrorKind("file_size");
        setUploadError(rawMsg);
      } else if (rawMsg.includes("format") || rawMsg.includes("type") || rawMsg.includes("unsupported")) {
        setUploadErrorKind("file_type");
        setUploadError(rawMsg);
      } else if (rawMsg.includes("500") || rawMsg.includes("502") || rawMsg.includes("503") || rawMsg.includes("server")) {
        setUploadErrorKind("server");
        setUploadError("Server error. Please try again in a moment.");
      } else {
        setUploadErrorKind("unknown");
        setUploadError(rawMsg);
      }
      toast.error(uploadError || "Upload failed");
    } finally {
      xhrRef.current = null;
      setUploading(false);
    }
  };

  const cancelUpload = () => { xhrRef.current?.abort(); };
  const retryUpload = () => { if (lastFile) { setUploadErrorKind("none"); setUploadError(null); upload(lastFile); } };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragOver(false);
    if (disableUpload || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  };

  const clear = () => {
    onChange("");
    setUploadError(null);
    setUploadErrorKind("none");
    setLastFile(null);
    setBytes(null);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const errorMeta = (() => {
    switch (uploadErrorKind) {
      case "file_size":
        return {
          icon: <FileWarning className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: `Choose a smaller file (max ${kind === "image" ? MAX_IMAGE_MB : MAX_VIDEO_MB} MB).`,
          action: "pick_smaller",
        };
      case "file_type":
        return {
          icon: <FileWarning className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: `Supported formats: ${kind === "image" ? "PNG, JPG, WebP, GIF, AVIF" : "MP4, WebM, MOV"}.`,
          action: "pick_valid",
        };
      case "auth":
        return {
          icon: <Lock className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: "Your session may have expired. Refresh the page or sign in again.",
          action: "retry",
        };
      case "network":
        return {
          icon: <WifiOff className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: "Check your internet connection, then retry.",
          action: "retry",
        };
      case "server":
        return {
          icon: <ServerCrash className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: "Server is temporarily unavailable. Please wait a moment and retry.",
          action: "retry",
        };
      case "bucket":
        return {
          icon: <ServerCrash className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: "Storage bucket misconfigured. Contact support@aisorix.com.",
          action: "none",
        };
      case "aborted":
        return {
          icon: <X className="w-4 h-4 text-muted-foreground flex-shrink-0" />,
          hint: "Upload cancelled. You can retry or pick a different file.",
          action: "retry",
        };
      case "unknown":
        return {
          icon: <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />,
          hint: "Something went wrong. Try again or use a direct URL instead.",
          action: "retry_or_url",
        };
      default:
        return null;
    }
  })();


  return (
    <div>
      <Label className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5" /> {label}</Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || (kind === "image" ? "https://...jpg or drop a file below" : "YouTube / Vimeo / .mp4 or drop a file below")}
          className={(showFormatError || showRequiredError ? "border-destructive " : "") + "pr-9"}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          {showFormatError || showRequiredError ? <AlertCircle className="w-4 h-4 text-destructive" />
            : url && loadState === "ok" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : url && loadState === "loading" ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            : url && loadState === "error" ? <AlertCircle className="w-4 h-4 text-amber-500" />
            : null}
        </div>
      </div>

      {showRequiredError && <p className="mt-1 text-xs text-destructive">Required.</p>}
      {showFormatError && <p className="mt-1 text-xs text-destructive">Enter a valid https:// URL.</p>}
      {!showFormatError && typeWarning && <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">{typeWarning}</p>}

      {!disableUpload && (
        <div
          onDragOver={(e) => { if (!uploading) { e.preventDefault(); setDragOver(true); } }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => { if (!uploading) inputRef.current?.click(); }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (!uploading && (e.key === "Enter" || e.key === " ")) inputRef.current?.click(); }}
          className={[
            "mt-2 rounded-lg border-2 border-dashed px-3 py-3 text-xs transition-colors",
            uploading ? "cursor-default" : "cursor-pointer",
            dragOver ? "border-primary bg-primary/5"
              : uploadError ? "border-destructive/60 bg-destructive/5"
              : "border-border bg-muted/20 hover:bg-muted/40",
          ].join(" ")}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                : uploadError ? <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                : <Upload className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              <span className="truncate text-muted-foreground">
                {uploading
                  ? `Uploading ${lastFile?.name ?? ""}`
                  : uploadError
                    ? uploadError
                    : dragOver
                      ? `Drop ${kind} to upload`
                      : `Drag & drop or click to upload (${kind === "image" ? `≤ ${MAX_IMAGE_MB} MB` : `≤ ${MAX_VIDEO_MB} MB`})`}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {uploading && (
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); cancelUpload(); }}>
                  <X className="w-3.5 h-3.5 mr-1" /> Cancel
                </Button>
              )}
              {!uploading && uploadError && lastFile && (
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-primary" onClick={(e) => { e.stopPropagation(); retryUpload(); }}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Retry
                </Button>
              )}
              {!uploading && value && (
                <Button type="button" variant="ghost" size="sm" className="h-7 px-2" onClick={(e) => { e.stopPropagation(); clear(); }}>
                  <X className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          {uploading && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full bg-muted rounded overflow-hidden">
                <div className="h-full bg-primary transition-all duration-150" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground tabular-nums">
                <span>{progress}%</span>
                {bytes && <span>{formatBytes(bytes.loaded)} / {formatBytes(bytes.total)}</span>}
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={acceptAttr}
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
          />
        </div>
      )}


      {preview && (
        <div className="mt-2 rounded-lg border border-border overflow-hidden bg-muted/30">
          {preview.type === "img" && (
            <div className="relative">
              <img src={preview.src} alt="" loading="lazy"
                className="w-full max-h-56 object-cover bg-background"
                onLoad={() => setLoadState("ok")} onError={() => setLoadState("error")} />
              {loadState === "error" && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 text-xs text-destructive gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Image failed to load
                </div>
              )}
            </div>
          )}
          {preview.type === "video" && (
            <div className="aspect-video bg-black">
              <video src={preview.src} controls preload="metadata" className="w-full h-full object-contain"
                onLoadedMetadata={() => setLoadState("ok")} onError={() => setLoadState("error")} />
            </div>
          )}
          {preview.type === "iframe" && (
            <div className="aspect-video bg-black">
              <iframe src={preview.src} title="preview" className="w-full h-full"
                allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen
                onLoad={() => setLoadState("ok")} />
            </div>
          )}
          <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px] text-muted-foreground border-t border-border">
            <span className="inline-flex items-center gap-1.5 min-w-0">
              {sourceLabel && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium text-[10px] uppercase tracking-wide">
                  {sourceLabel}
                </span>
              )}
              <span className="truncate">{url?.hostname}</span>
            </span>
            <a href={preview.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-foreground" onClick={(e) => e.stopPropagation()}>
              Open <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default MediaUrlField;
