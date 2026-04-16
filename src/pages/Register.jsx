import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, User, Loader2, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Redirect if already logged in - redirect to /chat
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/chat");
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordRequirements = useMemo(() => {
    const pw = formData.password;
    return {
      minLength: pw.length >= 8,
      hasLower: /[a-z]/.test(pw),
      hasUpper: /[A-Z]/.test(pw),
      hasNumber: /[0-9]/.test(pw),
      hasSpecial: /[^A-Za-z0-9]/.test(pw),
    };
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRequirements.minLength) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!passwordRequirements.hasLower) {
      newErrors.password = "Password must include a lowercase letter";
    } else if (!passwordRequirements.hasUpper) {
      newErrors.password = "Password must include an uppercase letter";
    } else if (!passwordRequirements.hasNumber) {
      newErrors.password = "Password must include a number";
    } else if (!passwordRequirements.hasSpecial) {
      newErrors.password = "Password must include a special character";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      setIsSubmitting(false);

      if (error) {
        let errorMessage = "Failed to create account. Please try again.";

        if (
          error.code === "user_already_exists" ||
          error.message?.includes("already registered") ||
          error.message?.includes("User already registered")
        ) {
          errorMessage = "This email is already registered. Please sign in instead.";
        } else if (error.message?.includes("rate limit") || error.message?.includes("429") || error.status === 429) {
          errorMessage = "Too many attempts. Please wait a few minutes before trying again.";
        } else if (error.message?.toLowerCase().includes("weak") || error.code === "weak_password") {
          errorMessage =
            "Password is too weak. Use at least 8 characters with uppercase, lowercase, numbers, and special characters.";
        } else if (error.message?.includes("Password")) {
          errorMessage = error.message;
        } else if (error.message?.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        toast.error("Registration Failed", { description: errorMessage });
      } else if (data?.session) {
        // Auto-confirmed: user has a session, go straight to chat
        sessionStorage.setItem("justRegistered", "true");
        toast.success("Account Created!", { description: "Welcome to AI Sorix!" });
        navigate("/chat");
      } else {
        // Fallback: email verification required
        setShowOtp(true);
        sessionStorage.setItem("justRegistered", "true");
        toast.success("Email Sent!", { description: "Please check your email to verify your account." });
      }
    } catch (err) {
      setIsSubmitting(false);
      console.error("Registration error:", err);
      toast.error("Registration Failed", {
        description: err?.message || "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleResendCode = async () => {
    setIsSubmitting(true);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: formData.email,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to Resend", { description: error.message || "Please wait a moment before trying again." });
    } else {
      toast.success("Email Resent!", { description: "Please check your email for the verification link." });
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
        title="Register | AI Sorix"
        description="Create your free AI Sorix account and access the world's most advanced AI models for research, content creation, and image generation."
        path="/register"
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
              <CardTitle className="text-2xl font-bold text-foreground">
                {showOtp ? "Verify your email" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-2">
                {showOtp
                  ? `Enter the 6-digit code sent to ${formData.email}`
                  : "Unlock Agentic AI powered by ChatGPT, Claude, Gemini, and 10+ cutting-edge models"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {showOtp ? (
              /* Email Verification Message */
              <div className="space-y-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">Check your email</h3>
                    <p className="text-sm text-muted-foreground">We've sent a verification link to</p>
                    <p className="text-sm font-medium text-foreground">{formData.email}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Click the link in your email to verify your account and complete registration.
                </p>

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={isSubmitting}
                    className="text-primary font-semibold"
                  >
                    {isSubmitting ? "Sending..." : "Resend Email"}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowOtp(false);
                  }}
                  className="w-full text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign Up
                </Button>
              </div>
            ) : (
              /* Registration Form */
              <>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={`pl-10 h-12 border-border focus:border-primary ${errors.fullName ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={`pl-10 h-12 border-border focus:border-primary ${errors.email ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
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
                    {formData.password.length > 0 && (
                      <div className="space-y-1 pt-1">
                        {[
                          { met: passwordRequirements.minLength, label: "At least 8 characters" },
                          { met: passwordRequirements.hasUpper, label: "One uppercase letter" },
                          { met: passwordRequirements.hasLower, label: "One lowercase letter" },
                          { met: passwordRequirements.hasNumber, label: "One number" },
                          { met: passwordRequirements.hasSpecial, label: "One special character" },
                        ].map((req) => (
                          <div key={req.label} className="flex items-center gap-1.5">
                            {req.met ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <X className="w-3 h-3 text-muted-foreground/50" />
                            )}
                            <span className={`text-xs ${req.met ? "text-green-500" : "text-muted-foreground"}`}>
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 h-12 border-border focus:border-primary ${errors.confirmPassword ? "border-red-500" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 gradient-primary text-foreground font-semibold text-base hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-semibold hover:text-primary/80 transition-colors">
                    Sign In
                  </Link>
                </p>

                <p className="text-center text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link to="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">© 2025 AI Sorix by Sorixlab. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Register;
