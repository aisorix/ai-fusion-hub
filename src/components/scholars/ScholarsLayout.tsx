import { Outlet } from "react-router-dom";
import ScholarsNavbar from "./ScholarsNavbar";
import ScholarsFooter from "./ScholarsFooter";
import { ScholarsI18nProvider } from "@/contexts/ScholarsI18nContext";

export default function ScholarsLayout() {
  return (
    <ScholarsI18nProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <ScholarsNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <ScholarsFooter />
      </div>
    </ScholarsI18nProvider>
  );
}
