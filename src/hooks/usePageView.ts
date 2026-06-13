import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getDevice(): string {
  if (typeof window === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  return "Desktop";
}

function getSource(referrer: string): string {
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("google."))   return "google.com";
    if (host.includes("facebook.")) return "facebook.com";
    if (host.includes("bing."))     return "bing.com";
    if (host.includes("instagram."))return "instagram.com";
    return host;
  } catch { return "Direct"; }
}

function getSessionId(): string {
  const key = "aisorix-session";
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function usePageView() {
  const loc = useLocation();
  const last = useRef<string>("");
  useEffect(() => {
    const path = loc.pathname;
    if (path === last.current) return;
    if (path.startsWith("/admin")) return; // exclude admin self-traffic
    last.current = path;
    try {
      supabase.rpc("log_page_view", {
        _path: path,
        _session_id: getSessionId(),
        _referrer: document.referrer || null,
        _source: getSource(document.referrer || ""),
        _device: getDevice(),
        _country: null,
        _user_agent: navigator.userAgent.slice(0, 256),
      }).then(() => {}, () => {});
    } catch {}
  }, [loc.pathname]);
}
