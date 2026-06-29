import { useState } from "react";
import { Menu, Search } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

const navItems = [
  { label: "Platform", href: "#solution" },
  { label: "Solutions", href: "#problem" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
];

export function Navbar() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="container-shell flex h-20 items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted transition-colors hover:text-foreground"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => openAuth("login")}
            >
              Login
            </Button>
            <Button size="lg" onClick={() => openAuth("signup")}>
              Sign Up
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="outline"
              className="h-10 px-4"
              onClick={() => openAuth("login")}
            >
              Login
            </Button>
            <Button className="h-10 px-4" onClick={() => openAuth("signup")}>
              Sign Up
            </Button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <AuthModal
        open={authOpen}
        mode={authMode}
        onOpenChange={setAuthOpen}
        onModeChange={setAuthMode}
      />
    </>
  );
}
