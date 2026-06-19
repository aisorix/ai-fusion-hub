import { Outlet } from "react-router-dom";
import ScholarsNavbar from "./ScholarsNavbar";
import ScholarsFooter from "./ScholarsFooter";
import { ScholarsI18nProvider } from "@/contexts/ScholarsI18nContext";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { scholarsChatRef } from "./scholarsChatRef";

export default function ScholarsLayout() {
  return (
    <ScholarsI18nProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ScholarsNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <ScholarsFooter />
        <ChatWidget ref={scholarsChatRef} />
      </div>
    </ScholarsI18nProvider>
  );
}
