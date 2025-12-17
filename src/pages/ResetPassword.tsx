import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Phone, ShieldCheck, Sparkles } from "lucide-react";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ensureCsrfCookie, requestPasswordReset } from "@/api/auth";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: unknown } | undefined)?.detail;
    if (typeof detail === "string" && detail.trim().length > 0) {
      return detail;
    }
    if (typeof error.message === "string") {
      return error.message;
    }
  }
  return "We couldn't send the reset code. Please try again.";
};

const ResetPassword = () => {
  const [method, setMethod] = useState("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast({
        title: "Email required",
        description: "Enter the email linked to your account.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset({ email: email.trim() });
      toast({
        title: "Verification sent",
        description: response.detail,
      });

      navigate("/verify-otp", {
        state: {
          mode: "reset" as const,
          email: email.trim(),
        },
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneRecovery = () => {
    toast({
      title: "Phone recovery unavailable",
      description: "Use your registered email to reset your password.",
    });
  };

  useEffect(() => {
    ensureCsrfCookie().catch(() => {
      // Ignore failures; next request will retry.
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-12 w-full"
          eyebrow="Account Security"
          title="Reset Your Access"
          description="Confirm your identity and we'll guide you through creating a new password for your Technoheaven workspace."
          align="center"
          topic="Password Recovery"
          contentClassName="w-full max-w-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto flex w-full max-w-4xl flex-col gap-8 md:flex-row"
        >
          <div className="w-full rounded-3xl border border-border/60 bg-card/90 p-8 shadow-xl backdrop-blur md:w-2/3">
            <Tabs value={method} onValueChange={setMethod} className="w-full">
              <TabsList className="mb-6 grid h-12 w-full grid-cols-2 rounded-full bg-muted/60 p-1">
                <TabsTrigger value="email" className="rounded-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Recover via Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="rounded-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Recover via Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-5">
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="email">Registered email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      autoComplete="email"
                      onChange={(event) => setEmail(event.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      We'll email you a verification code and a secure link to continue resetting your password.
                    </p>
                  </div>
                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending email..." : "Send verification email"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="phone" className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Include your country code"
                    disabled
                  />
                  <p className="text-sm text-muted-foreground">
                    SMS recovery isn't available yet. Use your email instead or contact support.
                  </p>
                </div>
                <Button className="w-full" type="button" onClick={handlePhoneRecovery}>
                  Notify me when available
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          <aside className="w-full space-y-4 rounded-3xl border border-primary/30 bg-primary/5 p-8 shadow-lg md:w-1/3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Security checklist</h3>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>• Your password must contain at least 10 characters.</li>
              <li>• Combine uppercase, lowercase, numbers, and a special character.</li>
              <li>• Avoid reusing passwords from other services.</li>
              <li>• Enable multifactor authentication once you regain access.</li>
            </ul>
            <div className="rounded-2xl border border-dashed border-primary/40 bg-white/40 p-5 text-sm text-muted-foreground shadow-inner">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">Need additional help?</span>
              </div>
              Contact the Technoheaven security operations desk via <Link to="/contact" className="text-primary underline">support ticket</Link> to flag suspicious account activity.
            </div>
          </aside>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
