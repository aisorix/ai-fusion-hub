import { Outlet } from "react-router-dom";
import ScholarsNavbar from "./ScholarsNavbar";
import ScholarsFooter from "./ScholarsFooter";

export default function ScholarsLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScholarsNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScholarsFooter />
    </div>
  );
}
