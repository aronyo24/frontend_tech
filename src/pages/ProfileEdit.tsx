import axios from "axios";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Loader2, Trash2, Undo2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/api/auth";
import type { ProfileUpdatePayload } from "@/types/interface";
import { COUNTRY_OPTIONS } from "@/data/countries";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  displayName: string;
  phoneNumber: string;
  profession: string;
  country: string;
  countryCode: string;
  age: string;
  avatarFile: File | null;
}

const getFlagEmoji = (code: string) => {
  if (!code || code.length !== 2) {
    return "";
  }
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0)),
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
    const detail = extractFirstMessage(error.response?.data);
    if (detail) {
      return detail;
    }
    if (error.message) {
      return error.message;
    }
  }
  return "We couldn't update your profile. Please try again.";
};

const ProfileEdit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const { toast } = useToast();
  const { user, setUser, loading: authLoading } = useAuth();
  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    displayName: "",
    phoneNumber: "",
    profession: "",
    country: "",
    countryCode: "",
    age: "",
    avatarFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const updatePreview = useCallback((url: string | null, markAsBlob = false) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current);
      previewObjectUrlRef.current = null;
    }
    if (markAsBlob && url) {
      previewObjectUrlRef.current = url;
    }
    setPreviewUrl(url);
  }, []);

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    };
  }, []);

  const resolvedDisplayName = useMemo(() => {
    if (!user) {
      return "";
    }
    const preferred = user.profile?.display_name?.trim();
    if (preferred) {
      return preferred;
    }
    const fullName = `${user.first_name?.trim() ?? ""} ${user.last_name?.trim() ?? ""}`.trim();
    if (fullName) {
      return fullName;
    }
    return user.username || user.email || "";
  }, [user]);

  const avatarInitials = useMemo(() => {
    if (resolvedDisplayName) {
      const parts = resolvedDisplayName.split(" ").filter(Boolean);
      const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
      if (initials) {
        return initials;
      }
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  }, [resolvedDisplayName, user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setFormState({
      firstName: user.first_name ?? "",
      lastName: user.last_name ?? "",
      displayName: user.profile?.display_name ?? "",
      phoneNumber: user.profile?.phone_number ?? "",
      profession: user.profile?.profession ?? "",
      country: user.profile?.country ?? "",
      countryCode: user.profile?.country_code ?? "",
      age: user.profile?.age ? String(user.profile.age) : "",
      avatarFile: null,
    });
    setRemoveExistingImage(false);
    updatePreview(user.profile?.profile_image ?? null);
  }, [updatePreview, user]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setFormState((prev) => ({ ...prev, avatarFile: file }));
    setRemoveExistingImage(false);
    const objectUrl = URL.createObjectURL(file);
    updatePreview(objectUrl, true);
  };

  const handleRemovePhoto = () => {
    if (formState.avatarFile) {
      setFormState((prev) => ({ ...prev, avatarFile: null }));
      updatePreview(user?.profile?.profile_image ?? null);
      return;
    }
    if (!user?.profile?.profile_image) {
      return;
    }
    setRemoveExistingImage(true);
    updatePreview(null);
  };

  const handleRestorePhoto = () => {
    setRemoveExistingImage(false);
    setFormState((prev) => ({ ...prev, avatarFile: null }));
    updatePreview(user?.profile?.profile_image ?? null);
  };

  const handleCountryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, country: event.target.value }));
  };

  const handleCountryCodeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, countryCode: event.target.value }));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }

    const ageValue = formState.age.trim();
    let age: number | null | undefined = undefined;
    if (ageValue.length > 0) {
      const parsed = Number(ageValue);
      if (!Number.isFinite(parsed) || parsed < 0) {
        toast({
          title: "Invalid age",
          description: "Enter a whole number or leave the field blank.",
          variant: "destructive",
        });
        return;
      }
      age = parsed;
    } else {
      age = null;
    }

    const payload: ProfileUpdatePayload = {
      first_name: formState.firstName.trim(),
      last_name: formState.lastName.trim(),
      display_name: formState.displayName.trim(),
      phone_number: formState.phoneNumber.trim(),
      profession: formState.profession.trim(),
      country: formState.country,
      country_code: formState.countryCode,
      age,
    };

    if (formState.avatarFile) {
      payload.profile_image = formState.avatarFile;
    } else if (removeExistingImage) {
      payload.remove_profile_image = true;
    }

    setIsSubmitting(true);
    try {
      const response = await updateProfile(payload);
      setUser(response.user);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Update failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCountryKnown = useMemo(
    () => formState.country ? COUNTRY_OPTIONS.some((item) => item.code === formState.country) : false,
    [formState.country],
  );

  const isDialKnown = useMemo(
    () => formState.countryCode ? dialCodeOptions.some((item) => item.dial === formState.countryCode) : false,
    [dialCodeOptions, formState.countryCode],
  );

  if (authLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 pb-16 pt-28">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Account Settings
            </p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">Edit profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Update your personal details and how others see you across the platform.
            </p>
          </header>

          <Card className="border border-primary/10 bg-card/90 shadow-lg">
            <CardHeader>
              <CardTitle>Profile details</CardTitle>
              <CardDescription>Personalize your account info and contact preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <section>
                  <Label className="text-sm font-medium text-foreground">Profile photo</Label>
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    <Avatar className="h-20 w-20 border border-border/70 bg-muted">
                      {previewUrl ? (
                        <AvatarImage src={previewUrl} alt={resolvedDisplayName || "Profile preview"} />
                      ) : null}
                      <AvatarFallback>{avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-wrap gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Upload new
                      </Button>
                      {(previewUrl || (user.profile?.profile_image && !removeExistingImage)) && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleRemovePhoto}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {formState.avatarFile ? "Clear selection" : "Remove photo"}
                        </Button>
                      )}
                      {removeExistingImage && user.profile?.profile_image ? (
                        <Button type="button" variant="ghost" onClick={handleRestorePhoto}>
                          <Undo2 className="mr-2 h-4 w-4" />
                          Keep current photo
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Use a square image at least 200px wide for best results.
                  </p>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      autoComplete="given-name"
                      onChange={handleInputChange}
                      placeholder="Maria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      autoComplete="family-name"
                      onChange={handleInputChange}
                      placeholder="Okafor"
                    />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="displayName">Display name</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      value={formState.displayName}
                      autoComplete="nickname"
                      onChange={handleInputChange}
                      placeholder="What should people call you?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={user.email} disabled />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-[180px_1fr]">
                  <div>
                    <Label htmlFor="countryCode">Country code</Label>
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formState.countryCode}
                      onChange={handleCountryCodeChange}
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select code</option>
                      {!isDialKnown && formState.countryCode ? (
                        <option value={formState.countryCode}>{`Current: ${formState.countryCode}`}</option>
                      ) : null}
                      {dialCodeOptions.map((option) => (
                        <option key={option.dial} value={option.dial}>
                          {`${getFlagEmoji(option.code)} ${option.dial}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formState.phoneNumber}
                      autoComplete="tel"
                      onChange={handleInputChange}
                      placeholder="1700-000000"
                    />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="country">Country / region</Label>
                    <select
                      id="country"
                      name="country"
                      value={formState.country}
                      onChange={handleCountryChange}
                      className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select country</option>
                      {!isCountryKnown && formState.country ? (
                        <option value={formState.country}>{`Current: ${formState.country}`}</option>
                      ) : null}
                      {COUNTRY_OPTIONS.map((country) => (
                        <option key={country.code} value={country.code}>
                          {`${getFlagEmoji(country.code)} ${country.name}`.trim()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formState.profession}
                      onChange={handleInputChange}
                      placeholder="e.g. Product Designer"
                    />
                  </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      value={formState.age}
                      onChange={handleInputChange}
                      placeholder="Leave blank to hide"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="flex flex-col justify-end text-xs text-muted-foreground">
                    <p>We only use your age to personalize insights. Leave blank if you prefer not to share.</p>
                  </div>
                </section>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Save changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
