import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { rememberLastVisited } from "@/lib/authRedirect";

/**
 * Records the user's most recent non-auth path so that, after login/register
 * (including OAuth round-trips), we can bounce them back to where they were.
 */
const LastVisitedTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search + location.hash;
    rememberLastVisited(path);
  }, [location.pathname, location.search, location.hash]);

  return null;
};

export default LastVisitedTracker;
