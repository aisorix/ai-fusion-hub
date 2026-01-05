import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
