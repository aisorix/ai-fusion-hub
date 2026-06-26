import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "../assets/logo.png";
import { consumePostAuthRedirect } from "@/lib/authRedirect";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const explicitRedirect = searchParams.get("redirect");
  const { user, signIn, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate(consumePostAuthRedirect(location.state, explicitRedirect), { replace: true });
    }
  }, [user, authLoading, navigate, location.state, explicitRedirect]);

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error("Wrong password or email. Please check your credentials and try again.");
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please verify your email before signing in.");
      } else {
        toast.error("Failed to sign in. Please try again.");
      }
    } else {
      toast.success("Welcome back! You have successfully signed in.");
      navigate(consumePostAuthRedirect(location.state, explicitRedirect), { replace: true });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      <SEOHead
        title="Login | AI Sorix"
        description="Sign in to your AI Sorix account to access 15+ premium AI models, image generation, presentations, and more."
        path="/login"
      />
      {/* Header */}
      <div className="p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md border-border/50 shadow-2xl backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <Link to="/" className="inline-flex items-center justify-center gap-1.5 mx-auto">
              <img src={logo} alt="AI Sorix" className="w-12 h-12 object-contain" />
              <span className="text-2xl font-bold text-foreground">AI Sorix</span>
            </Link>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                Sign in to access all AI Tools, intelligent Chats, and autonomous Agents
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 h-12 border-border focus:border-primary ${errors.email ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 h-12 border-border focus:border-primary ${errors.password ? "border-red-500" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 gradient-primary text-foreground font-semibold text-base hover:opacity-90 transition-opacity"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">© 2026 AI Sorix by Sorixlab. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;
