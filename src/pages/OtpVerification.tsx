import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Clock, Lock, RefreshCw, Shield } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";
import {
  resendOtp,
  requestPasswordReset,
  resetPassword,
  verifyOtp,
} from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

interface LocationState {
  email?: string;
  mode?: "register" | "reset";
  uidb64?: string;
  token?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
    if (typeof error.message === "string" && error.message.trim().length > 0) {
      return error.message;
    }
  }
  return "We couldn't verify the code. Please try again.";
};

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const state = (location.state ?? {}) as LocationState;
  const email = state.email;
  const mode = state.mode ?? "register";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const requiresPassword = mode === "reset";

  useEffect(() => {
    if (requiresPassword && !email) {
      toast({
        title: "Reset session expired",
        description: "Start the password reset process again.",
        variant: "destructive",
      });
      navigate("/reset-password", { replace: true });
    }
  }, [requiresPassword, email, navigate, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Enter the six-digit code we emailed to you.",
        variant: "destructive",
      });
      return;
    }

    if (requiresPassword) {
      if (!password || !confirmPassword) {
        toast({
          title: "Password required",
          description: "Provide and confirm your new password.",
          variant: "destructive",
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Make sure both password entries are identical.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (requiresPassword) {
        if (!email) {
          throw new Error("Missing email context for password reset.");
        }
        const response = await resetPassword({
          email,
          otp_code: otp,
          new_password: password,
          confirm_password: confirmPassword,
        });

        toast({
          title: "Password updated",
          description: response.detail,
        });
        navigate("/signin");
      } else {
        const response = await verifyOtp({
          email,
          otp_code: otp,
        });

        setUser(response.user);

        toast({
          title: "Email verified",
          description: response.detail,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendDescription = useMemo(() => {
    if (mode === "reset") {
      return "Resend reset code";
    }
    return "Resend verification";
  }, [mode]);

  const handleResend = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Go back and request the code again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      if (mode === "reset") {
        const response = await requestPasswordReset({ email });
        toast({
          title: "Code resent",
          description: response.detail,
        });
      } else {
        const response = await resendOtp({ email });
        toast({
          title: "Code resent",
          description: response.detail,
        });
      }
    } catch (error) {
      toast({
        title: "Unable to resend",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const submitLabel = requiresPassword ? "Verify code & reset password" : "Verify & continue";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-12 w-full"
          eyebrow="Two-Step Confirmation"
          title={requiresPassword ? "Reset Your Password" : "Verify Your Email"}
          description={
            requiresPassword
              ? "Enter the one-time passcode we sent to your inbox, then choose a new password."
              : "Enter the six-digit verification code to activate your Technoheaven account."
          }
          align="center"
          topic="OTP Verification"
          contentClassName="w-full max-w-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-3xl"
        >
          <div className="rounded-3xl border border-border/60 bg-card/90 p-10 shadow-xl backdrop-blur">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  The verification code expires in <span className="text-primary font-semibold">05:00 minutes</span>.
                  {email && (
                    <span className="block text-xs text-muted-foreground/80">Sent to {email}</span>
                  )}
                </p>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  containerClassName="flex justify-center"
                  disabled={isSubmitting}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot key={`otp-${index}`} index={index} className="h-12 w-12 text-lg font-semibold" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Didn't get the code?</span>
                  <Button
                    type="button"
                    variant="link"
                    className="px-1 py-0 text-sm"
                    onClick={handleResend}
                    disabled={isResending}
                  >
                    {isResending ? "Sending..." : resendDescription}
                  </Button>
                </div>
              </div>

              {requiresPassword && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={password}
                        autoComplete="new-password"
                        onChange={(event) => setPassword(event.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              )}

              {requiresPassword && (
                <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-sm text-muted-foreground">
                  <div className="mb-2 flex items-center gap-2 text-foreground">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="font-semibold">Password requirements</span>
                  </div>
                  Use at least one uppercase letter, one number, and one symbol. Avoid reusing an existing password.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : submitLabel}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Need to start over?</span>
              </div>
              <Link to={requiresPassword ? "/reset-password" : "/signup"} className="font-medium text-primary hover:underline">
                {requiresPassword ? "Restart reset flow" : "Return to sign up"}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OtpVerification;
