import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ensureCsrfCookie, getGoogleAuthUrl, loginUser, resendOtp } from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";

interface SignInFormState {
  email: string;
  password: string;
  remember: boolean;
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
  return "Unable to sign in right now. Please try again.";
};

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [formState, setFormState] = useState<SignInFormState>({
    email: "",
    password: "",
    remember: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState("");

  useEffect(() => {
    ensureCsrfCookie().catch(() => {
      // Silent failure; the following request will retrigger CSRF fetch.
    });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.email || !formState.password) {
      toast({
        title: "Missing information",
        description: "Enter both your email and password to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: formState.email.trim(),
        password: formState.password,
      });

      if (response.requires_verification) {
        toast({
          title: "Verify your account",
          description: response.detail,
        });
        navigate("/verify-otp", {
          state: {
            email: formState.email.trim(),
            mode: "register" as const,
            uidb64: response.uidb64,
            token: response.token,
          },
        });
        return;
      }

      if ("user" in response) {
        setUser(response.user);
      }

      toast({
        title: "Signed in",
        description: "Welcome back to Technoheaven!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Sign-in failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = () => {
    const url = getGoogleAuthUrl();
    // debug: log the URL used for Google auth
    // eslint-disable-next-line no-console
    console.debug('Redirecting to Google auth URL:', url);
    window.location.assign(url);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-12 w-full"
          eyebrow="Account Access"
          title="Welcome Back"
          description="Sign in to continue building, collaborating, and tracking your Technoheaven programmes."
          align="center"
          topic="Sign In"
          contentClassName="w-full max-w-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-2xl"
        >
          <div className="rounded-3xl border border-border/60 bg-card/90 p-10 shadow-xl backdrop-blur">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={formState.email}
                    autoComplete="email"
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formState.password}
                    autoComplete="current-password"
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, password: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={formState.remember}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, remember: event.target.checked }))
                    }
                  />
                  <span>Remember me</span>
                </label>
                <Link to="/reset-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="my-6 flex items-center gap-3 text-sm text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              <span>or continue with</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => {
                const url = getGoogleAuthUrl("/dashboard");
                if (typeof window !== "undefined") {
                  window.location.href = url;
                }
              }}
            >
              <span className="mr-2 flex h-5 w-5 items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.6 3.6v3h4.2c2.4-2.2 3.4-5.4 3.4-8.7z" fill="#4285F4" />
                  <path d="M12 24c3.2 0 5.9-1 7.9-2.7l-4.2-3c-1.1.7-2.5 1.1-3.8 1.1-2.9 0-5.3-1.9-6.1-4.6H1.4v2.9C3.4 21.2 7.3 24 12 24z" fill="#34A853" />
                  <path d="M5.9 14.8c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7.5H1.4C.5 9.2 0 11 0 12.8s.5 3.6 1.4 5.3l4.5-3.3z" fill="#FBBC05" />
                  <path d="M12 4.7c1.7 0 3.2.6 4.3 1.7l3.2-3.2C17.9 1.2 15.2 0 12 0 7.3 0 3.4 2.8 1.4 7.5l4.5 3.3c.8-2.7 3.2-4.6 6.1-4.6z" fill="#EA4335" />
                </svg>
              </span>
              Continue with Google
            </Button>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Sign Up
              </Link>
            </div>
            <div className="mt-3 text-center text-sm">
              {!showVerifyInput ? (
                <>
                  <span className="text-muted-foreground">Already registered but didn't verify your email? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVerifyInput(true);
                      setVerifyEmail(formState.email || "");
                    }}
                    className="font-medium text-primary hover:underline"
                  >
                    Resend verification email / Verify now
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex w-full max-w-sm items-center gap-2">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={verifyEmail}
                      onChange={(e) => setVerifyEmail(e.target.value)}
                      className="!p-2"
                    />
                    <Button
                      onClick={async () => {
                        const email = verifyEmail.trim();
                        if (!email) {
                          toast({ title: "Email required", description: "Enter an email to resend verification.", variant: "destructive" });
                          return;
                        }
                        try {
                          setIsSubmitting(true);
                          await ensureCsrfCookie();
                          const resp = await resendOtp({ email });
                          toast({ title: "Verification sent", description: (resp && (resp.detail as string)) || "Check your inbox for the code." });
                          // navigate to verify page to enter code
                          navigate("/verify-otp", { state: { email, mode: "register" as const } });
                          setShowVerifyInput(false);
                        } catch (err) {
                          const msg = axios.isAxiosError(err) ? (err.response?.data as any)?.detail || err.message : String(err);
                          toast({ title: "Unable to send", description: msg, variant: "destructive" });
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    >
                      Send
                    </Button>
                    <Button variant="ghost" onClick={() => setShowVerifyInput(false)}>Cancel</Button>
                  </div>
                  <div className="text-xs text-muted-foreground">We'll send a verification code to the entered address.</div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;
