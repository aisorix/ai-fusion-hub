import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function ScholarsFooter() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/sorixscholars" className="flex items-center gap-1.5">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-500 grid place-items-center">
              <GraduationCap className="w-4 h-4 text-primary-foreground" />
            </span>
            <span
              className="text-base font-bold text-foreground"
              style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              Sorix Scholars
            </span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-md leading-relaxed">
            Learn frontier AI. Build production-grade skills. Earn certificates recognised across
            the AI Sorix ecosystem.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
            Explore
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/sorixscholars/courses"
                className="text-muted-foreground hover:text-foreground"
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/sorixscholars/competitions"
                className="text-muted-foreground hover:text-foreground"
              >
                Competitions
              </Link>
            </li>
            <li>
              <Link
                to="/sorixscholars/certificates"
                className="text-muted-foreground hover:text-foreground"
              >
                Certificates
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
            AI Sorix
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground">
                Platform
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Sorix Scholars · part of AI Sorix
      </div>
    </footer>
  );
}
