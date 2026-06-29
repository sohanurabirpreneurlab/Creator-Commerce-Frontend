import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

const navItems = [
  { label: "Platform", href: "#solution" },
  { label: "Solutions", href: "#problem" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
];

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const desktopProfileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement | null>(null);

  const openAuth = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideDesktop = desktopProfileMenuRef.current?.contains(
        event.target as Node,
      );
      const clickedInsideMobile = mobileProfileMenuRef.current?.contains(
        event.target as Node,
      );

      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            {isAuthenticated && user ? (
              <div className="relative" ref={desktopProfileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((current) => !current)}
                  className="flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2 shadow-soft transition-colors hover:border-primary"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {initials}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {user.name}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </button>

                {profileMenuOpen ? (
                  <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-border bg-white p-2 shadow-hero">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-primary-dark" />
                      Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 text-primary-dark" />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {isAuthenticated && user ? (
              <div className="relative" ref={mobileProfileMenuRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((current) => !current)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                >
                  {initials}
                </button>
                {profileMenuOpen ? (
                  <div className="absolute right-0 mt-3 w-48 rounded-3xl border border-border bg-white p-2 shadow-hero">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-primary-dark" />
                      Profile
                    </button>
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-slate-50"
                    >
                      <Settings className="h-4 w-4 text-primary-dark" />
                      Settings
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <>
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
              </>
            )}
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
