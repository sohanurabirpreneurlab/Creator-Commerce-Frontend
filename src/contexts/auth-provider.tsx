import { useEffect, useMemo, useState } from "react";
import * as authApi from "@/lib/auth-api";
import { AuthContext } from "@/contexts/auth-context";
import { AuthResult, AuthUser, UserRole } from "@/types/auth";

type StoredAuthSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = "creator-commerce-auth";

function isValidRole(role: unknown): role is UserRole {
  return (
    role === "CREATOR" ||
    role === "BRAND_MANAGER" ||
    role === "SUPER_ADMIN"
  );
}

function getStoredSession(): StoredAuthSession | null {
  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawValue) as Partial<StoredAuthSession>;

    // Older sessions may not contain role yet. Force logout instead of defaulting,
    // so dashboard UI does not make role assumptions from stale client state.
    if (!parsedSession.user || !isValidRole(parsedSession.user.role)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    if (!parsedSession.token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      token: parsedSession.token,
      user: parsedSession.user as AuthUser,
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedSession = getStoredSession();

    if (storedSession) {
      setToken(storedSession.token);
      setUser(storedSession.user);
    }
  }, []);

  const persistSession = (session: AuthResult) => {
    setToken(session.token);
    setUser(session.user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login: async (payload: Parameters<typeof authApi.login>[0]) => {
        const session = await authApi.login(payload);
        persistSession(session);
        return session;
      },
      signUp: async (payload: Parameters<typeof authApi.signUp>[0]) => {
        const session = await authApi.signUp(payload);
        persistSession(session);
        return session;
      },
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
