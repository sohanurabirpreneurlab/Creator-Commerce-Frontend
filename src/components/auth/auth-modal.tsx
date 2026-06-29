import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowRight, LoaderCircle, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

type LoginFormValues = {
  identifier: string;
  password: string;
};

type SignupFormValues = {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  address: string;
  gender: string;
  dateOfBirth: string;
};

type AuthModalProps = {
  open: boolean;
  mode: AuthMode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: AuthMode) => void;
};

const socialProviders = [
  { label: "Google", icon: GoogleIcon },
  { label: "Facebook", icon: FacebookIcon },
  { label: "Instagram", icon: InstagramIcon },
];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-rose-500">{message}</p>;
}

function FormSuccess({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
      {message}
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      {socialProviders.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          className="items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:bg-slate-50"
        >
          <span className="flex  items-center justify-center rounded-full bg-slate-50">
            <Icon className="h-10 w-10 shrink-0" />
          </span>
          {/* <span className="whitespace-nowrap">{actionLabel}</span>
          <span className="whitespace-nowrap text-muted">via {label}</span> */}
        </button>
      ))}
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values);
      setSuccessMessage("Login successful.");
      onSuccess();
    } catch (error) {
      setSuccessMessage(null);
      setServerError(
        error instanceof Error ? error.message : "Unable to login right now.",
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="identifier">Email or Mobile Number</Label>
        <Input
          id="identifier"
          className="mt-2"
          placeholder="you@brand.com or +8801XXXXXXXXX"
          {...register("identifier", {
            required: "Email or mobile number is required.",
            minLength: {
              value: 6,
              message: "Enter a valid email or mobile number.",
            },
          })}
        />
        <FieldError message={errors.identifier?.message} />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          className="mt-2"
          placeholder="Enter your password"
          {...register("password", {
            required: "Password is required.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters.",
            },
          })}
        />
        <FieldError message={errors.password?.message} />
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Login
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {serverError ? <FieldError message={serverError} /> : null}
      {successMessage ? <FormSuccess message={successMessage} /> : null}
    </form>
  );
}

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signUp } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobileNumber: "",
      address: "",
      gender: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    try {
      await signUp(values);
      onSuccess();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to create your account right now.",
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            className="mt-2"
            placeholder="Full name"
            {...register("name", {
              required: "Name is required.",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
            })}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            className="mt-2"
            placeholder="you@brand.com"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address.",
              },
            })}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            className="mt-2"
            placeholder="At least 8 characters"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            })}
          />
          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input
            id="mobileNumber"
            className="mt-2"
            placeholder="+8801XXXXXXXXX"
            {...register("mobileNumber", {
              required: "Mobile number is required.",
              pattern: {
                value: /^[+]?[\d\s\-()]{8,20}$/,
                message: "Enter a valid mobile number.",
              },
            })}
          />
          <FieldError message={errors.mobileNumber?.message} />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            className="mt-2 flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...register("gender", {
              required: "Gender is required.",
            })}
          >
            <option value="">Select gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
          <FieldError message={errors.gender?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          className="mt-2"
          placeholder="Street, city, region"
          {...register("address", {
            required: "Address is required.",
            minLength: {
              value: 6,
              message: "Address must be at least 6 characters.",
            },
          })}
        />
        <FieldError message={errors.address?.message} />
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          className="mt-2"
          {...register("dateOfBirth", {
            required: "Date of birth is required.",
          })}
        />
        <FieldError message={errors.dateOfBirth?.message} />
      </div>

      <Button type="submit" size="lg" className="mt-1 w-full gap-2" disabled={isSubmitting}>
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Create Account
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {serverError ? <FieldError message={serverError} /> : null}
    </form>
  );
}

export function AuthModal({
  open,
  mode,
  onOpenChange,
  onModeChange,
}: AuthModalProps) {
  const isSignup = mode === "signup";
  const title = isSignup ? "Create your account" : "Welcome back";
  const description = useMemo(
    () =>
      isSignup
        ? ""
        : "Login to continue into your Creators Commerce workspace.",
    [isSignup],
  );

  const handleAuthSuccess = () => {
    onOpenChange(false);
  };

  const handleSignupSuccess = () => {
    handleAuthSuccess();
  };

  const handleLoginClick = () => onModeChange("login");
  const handleSignupClick = () => onModeChange("signup");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0">
        <div className="grid max-h-[88vh] min-h-0 lg:max-h-[92vh] lg:grid-cols-[0.88fr_1.12fr]">
          <div className="hidden bg-[linear-gradient(180deg,#15bee7_0%,#0f9fc6_100%)] p-8 text-white lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
                  <ShieldCheck className="h-4 w-4" />
                  Secure Access
                </div>
                <h3 className="mt-6 text-4xl font-extrabold leading-tight">
                  {isSignup
                    ? "Launch creator commerce with validated onboarding."
                    : "Track performance, revenue, and creator ROI in one place."}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                  Use email registration or continue with your social account.
                  This flow is UI-only for now and ready to connect to real auth
                  later.
                </p>
              </div>

              <div className="rounded-[28px] bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-white/85">
                  Built for brands that need reliable creator attribution, not
                  vanity metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-col overflow-hidden p-5 sm:p-7">
            <DialogHeader>
              <div className="flex gap-2 rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={handleLoginClick}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    !isSignup
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted",
                  )}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleSignupClick}
                  className={cn(
                    "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    isSignup
                      ? "bg-white text-foreground shadow-sm"
                      : "text-muted",
                  )}
                >
                  Sign Up
                </button>
              </div>
              <DialogTitle className="pt-4 ">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>

            <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
              <SocialButtons />

              <div className="my-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Or continue with form
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className={cn(isSignup ? "pb-2" : "")}>
                {isSignup ? (
                  <SignupForm onSuccess={handleSignupSuccess} />
                ) : (
                  <LoginForm onSuccess={handleAuthSuccess} />
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.4-.2-2.1H12Z"
      />
      <path
        fill="#34A853"
        d="M12 21c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-3.9l-3.2 2.5C5 18.8 8.2 21 12 21Z"
      />
      <path
        fill="#4A90E2"
        d="M6.6 13.1c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9L3.4 6.8C2.5 8.4 2 10.1 2 12s.5 3.6 1.4 5.2l3.2-2.5Z"
      />
      <path
        fill="#FBBC05"
        d="M12 5.2c1.4 0 2.7.5 3.7 1.4l2.7-2.7C16.8 2.3 14.6 1.4 12 1.4 8.2 1.4 5 3.6 3.4 6.8l3.2 2.5C7.4 6.9 9.5 5.2 12 5.2Z"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12C24 5.4 18.6 0 12 0S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.3c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-1.9.9-1.9 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12Z"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="35%" stopColor="#DD2A7B" />
          <stop offset="65%" stopColor="#8134AF" />
          <stop offset="100%" stopColor="#515BD4" />
        </linearGradient>
      </defs>
      <path
        fill="url(#instagram-gradient)"
        d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .3 2.5.5.6.2 1.1.5 1.6 1 .5.5.8 1 1 1.6.2.5.4 1.3.5 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 2-.5 2.5-.2.6-.5 1.1-1 1.6-.5.5-1 .8-1.6 1-.5.2-1.3.4-2.5.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.3-2.5-.5-.6-.2-1.1-.5-1.6-1-.5-.5-.8-1-1-1.6-.2-.5-.4-1.3-.5-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-2 .5-2.5.2-.6.5-1.1 1-1.6.5-.5 1-.8 1.6-1 .5-.2 1.3-.4 2.5-.5 1.3-.1 1.7-.1 4.9-.1Zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1 0-1.7.2-2.1.4-.5.2-.8.3-1.2.7-.4.4-.6.7-.7 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.8s0 3.5.1 4.8c0 1.1.2 1.7.4 2.1.2.5.3.8.7 1.2.4.4.7.6 1.2.7.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.8.1s3.5 0 4.8-.1c1.1 0 1.7-.2 2.1-.4.5-.2.8-.3 1.2-.7.4-.4.6-.7.7-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.8s0-3.5-.1-4.8c0-1.1-.2-1.7-.4-2.1-.2-.5-.3-.8-.7-1.2-.4-.4-.7-.6-1.2-.7-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.8-.1Zm0 3.1A4.9 4.9 0 1 1 7.1 12 4.9 4.9 0 0 1 12 7.1Zm0 8A3.1 3.1 0 1 0 8.9 12 3.1 3.1 0 0 0 12 15.1Zm6.2-8.2a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z"
      />
    </svg>
  );
}
