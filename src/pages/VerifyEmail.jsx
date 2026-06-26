import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Mail, Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import logo from "../assets/logo.png";
import { consumePostAuthRedirect } from "@/lib/authRedirect";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Get email from location state or redirect to register
  const email = location.state?.email;
  const password = location.state?.password;
  const fullName = location.state?.fullName;

  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Cooldown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email Verified!",
        description: "Your account has been created successfully. Welcome to AI Sorix!",
      });

      // Redirect back to where the user came from (or /chat) after verification
      navigate(consumePostAuthRedirect(location.state), { replace: true });
    } catch (error) {
      console.error("Verification error:", error);
      let errorMessage = "Invalid or expired verification code. Please try again.";
      if (error.message?.includes("expired")) {
        errorMessage = "Verification code has expired. Please request a new one.";
      }
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      toast({
        title: "Code Sent!",
        description: "A new verification code has been sent to your email.",
      });

      setResendCooldown(60); // 60 second cooldown
      setOtp("");
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: "Failed to Resend",
        description: error.message || "Could not resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6">
        <Link
          to="/register"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Register</span>
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
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">Verify Your Email</CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  We've sent a 6-digit verification code to
                </CardDescription>
                <p className="font-medium text-foreground mt-1">{email}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex flex-col items-center gap-4">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isVerifying}>
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="h-14 w-12 text-xl border-border" />
                  <InputOTPSlot index={1} className="h-14 w-12 text-xl border-border" />
                  <InputOTPSlot index={2} className="h-14 w-12 text-xl border-border" />
                  <InputOTPSlot index={3} className="h-14 w-12 text-xl border-border" />
                  <InputOTPSlot index={4} className="h-14 w-12 text-xl border-border" />
                  <InputOTPSlot index={5} className="h-14 w-12 text-xl border-border" />
                </InputOTPGroup>
              </InputOTP>

              <p className="text-sm text-muted-foreground text-center">
                Enter the code from your email. Check spam if not found.
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              className="w-full h-12 gradient-primary text-foreground font-semibold text-base hover:opacity-90 transition-opacity"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0}
                className="text-primary hover:text-primary/80"
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend in {resendCooldown}s
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Help text */}
            <p className="text-center text-xs text-muted-foreground">
              Having trouble?{" "}
              <Link to="/#contact" className="text-primary hover:underline">
                Contact Support
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

export default VerifyEmail;
