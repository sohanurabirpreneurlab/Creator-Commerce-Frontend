import { createContext } from "react";
import {
  AuthResult,
  AuthUser,
  LoginPayload,
  SignUpPayload,
} from "@/types/auth";

export type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  signUp: (payload: SignUpPayload) => Promise<AuthResult>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
