import axios from "axios";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Mail, Lock, User, Phone, Flag, Briefcase, Image as ImageIcon } from "lucide-react";
import { COUNTRY_OPTIONS } from "@/data/countries";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ensureCsrfCookie, registerUser } from "@/api/auth";

const PROFESSION_OPTIONS = [
  { value: "software-engineer", label: "Software Engineer" },
  { value: "product-manager", label: "Product Manager" },
  { value: "data-scientist", label: "Data Scientist" },
  { value: "ui-ux-designer", label: "UI/UX Designer" },
  { value: "qa-engineer", label: "QA Engineer" },
  { value: "project-manager", label: "Project Manager" },
  { value: "business-analyst", label: "Business Analyst" },
  { value: "researcher", label: "Researcher / Academic" },
  { value: "marketing", label: "Marketing / Growth" },
  { value: "sales", label: "Sales / Partnerships" },
  { value: "founder", label: "Founder / Entrepreneur" },
  { value: "consultant", label: "Consultant" },
  { value: "student", label: "Student" },
  { value: "government", label: "Government / Public Sector" },
  { value: "other", label: "Other (please specify)" },
];

interface SignUpFormState {
  firstName: string;
  lastName: string;
  username: string;
  age: string;
  email: string;
  country: string;
  countryCode: string;
  phoneNumber: string;
  profession: string;
  otherProfession: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

const getFlagEmoji = (code: string) => {
  if (!code || code.length !== 2) {
    return "";
  }
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
  );
};

const extractFirstMessage = (payload: unknown): string | null => {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload.trim();
  }

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const result = extractFirstMessage(item);
      if (result) {
        return result;
      }
    }
  }

  if (payload && typeof payload === "object") {
    for (const value of Object.values(payload as Record<string, unknown>)) {
      const result = extractFirstMessage(value);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = extractFirstMessage(error.response?.data);
    if (message) {
      return message;
    }

    if (error.message) {
      return error.message;
    }
  }

  return "We couldn't create your account. Please review the form and try again.";
};

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState<SignUpFormState>({
    firstName: "",
    lastName: "",
    username: "",
    age: "",
    email: "",
    country: "",
    countryCode: "",
    phoneNumber: "",
    profession: "",
    otherProfession: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  useEffect(() => {
    ensureCsrfCookie().catch(() => {
      // Silent failure.
    });
  }, []);

  const dialCodeOptions = useMemo(() => {
    const unique = new Map<string, { name: string; code: string }>();
    COUNTRY_OPTIONS.forEach((country) => {
      if (!unique.has(country.dial)) {
        unique.set(country.dial, { name: country.name, code: country.code });
      }
    });
    return Array.from(unique.entries())
      .sort((a, b) => {
        const numericA = parseInt(a[0].replace(/\D/g, ""), 10);
        const numericB = parseInt(b[0].replace(/\D/g, ""), 10);
        if (Number.isNaN(numericA) || Number.isNaN(numericB)) {
          return a[0].localeCompare(b[0]);
        }
        return numericA - numericB;
      })
      .map(([dial, { name, code }]) => ({ dial, name, code }));
  }, []);

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const match = COUNTRY_OPTIONS.find((country) => country.code === value);
    setFormState((prev) => ({
      ...prev,
      country: value,
      countryCode: match?.dial ?? prev.countryCode,
    }));
  };

  const handleDialChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      countryCode: event.target.value,
    }));
  };

  const handleProfessionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({
      ...prev,
      profession: event.target.value,
      otherProfession: event.target.value === "other" ? prev.otherProfession : "",
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formState.username || !formState.email || !formState.password || !formState.confirmPassword) {
      toast({
        title: "Missing information",
        description: "Username, email, and password are required.",
        variant: "destructive",
      });
      return;
    }

    if (formState.password !== formState.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please confirm your password accurately.",
        variant: "destructive",
      });
      return;
    }

    const ageValue = formState.age ? Number(formState.age) : undefined;
    if (ageValue !== undefined && (Number.isNaN(ageValue) || ageValue < 0)) {
      toast({
        title: "Invalid age",
        description: "Enter a valid age or leave the field empty.",
        variant: "destructive",
      });
      return;
    }

    const professionValue =
      formState.profession === "other"
        ? formState.otherProfession.trim() || undefined
        : formState.profession || undefined;

    setIsSubmitting(true);
    try {
      const response = await registerUser({
        username: formState.username.trim(),
        email: formState.email.trim(),
        password: formState.password,
        confirm_password: formState.confirmPassword,
        first_name: formState.firstName.trim() || undefined,
        last_name: formState.lastName.trim() || undefined,
        phone_number: formState.phoneNumber.trim() || undefined,
        age: ageValue,
        country: formState.country || undefined,
        country_code: formState.countryCode || undefined,
        profession: professionValue,
        profile_image: formState.profileImage,
      });

      toast({
        title: "Registration successful",
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
    } catch (error) {
      toast({
        title: "Unable to register",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <PageHero
          className="mb-12 w-full"
          eyebrow="Join Technoheaven"
          title="Create Account"
          description="Access delivery dashboards, collaborate with specialists, and manage your innovation pipeline."
          align="center"
          topic="Sign Up"
          contentClassName="w-full max-w-none"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-3xl"
        >
          <div className="rounded-3xl border border-border/60 bg-card/90 p-10 shadow-xl backdrop-blur">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="John"
                      className="pl-10"
                      value={formState.firstName}
                      autoComplete="given-name"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, firstName: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="Doe"
                      className="pl-10"
                      value={formState.lastName}
                      autoComplete="family-name"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, lastName: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="john.doe"
                      className="pl-10"
                      value={formState.username}
                      autoComplete="username"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, username: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Age</label>
                  <Input
                    type="number"
                    min={16}
                    max={120}
                    placeholder="28"
                    value={formState.age}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, age: event.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
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
                  <label className="mb-2 block text-sm font-medium">Country / Region</label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background/80 pl-10 pr-12 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formState.country}
                      onChange={handleCountryChange}
                    >
                      <option value="">Select country</option>
                      {COUNTRY_OPTIONS.map((country) => (
                        <option key={country.code} value={country.code}>
                          {`${getFlagEmoji(country.code)} ${country.name}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <div>
                  <label className="mb-2 block text-sm font-medium">Country Code</label>
                  <div className="relative">
                    <Flag className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background/80 pl-10 pr-12 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formState.countryCode}
                      onChange={handleDialChange}
                    >
                      <option value="">Select code</option>
                      {dialCodeOptions.map((option) => (
                        <option key={option.dial} value={option.dial}>
                          {`${getFlagEmoji(option.code)} ${option.dial}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="tel"
                      placeholder="1700-000000"
                      className="pl-10"
                      value={formState.phoneNumber}
                      autoComplete="tel"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, phoneNumber: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Profession</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <select
                      className="h-11 w-full appearance-none rounded-md border border-input bg-background/80 pl-10 pr-12 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={formState.profession}
                      onChange={handleProfessionChange}
                    >
                      <option value="">Select your profession</option>
                      {PROFESSION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formState.profession === "other" && (
                    <div className="mt-3">
                      <Input
                        type="text"
                        placeholder="If other, enter your profession"
                        value={formState.otherProfession}
                        onChange={(event) =>
                          setFormState((prev) => ({ ...prev, otherProfession: event.target.value }))
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formState.password}
                      autoComplete="new-password"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, password: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      value={formState.confirmPassword}
                      autoComplete="new-password"
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, confirmPassword: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Profile Photo (optional)</label>
                <div className="relative flex items-center gap-3 rounded-md border border-input bg-background/80 px-3 py-2">
                  <ImageIcon className="text-muted-foreground" size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFormState((prev) => ({
                        ...prev,
                        profileImage: event.target.files?.[0] ?? null,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="text-sm">
                <label className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-muted-foreground">
                    I agree to the <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/signin" className="font-medium text-primary hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
