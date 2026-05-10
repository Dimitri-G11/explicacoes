// ============================================================
//  🎓 AUTH CONTEXT — useContext em ação!
//
//  Conceitos cobertos:
//    - createContext
//    - useContext
//    - useState para guardar o token e usuário logado
//    - localStorage para persistência
//    - Provider envolvendo a aplicação
// ============================================================
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiPost } from "@/lib/api";

// 1️⃣ Definir o formato dos dados do contexto
interface AuthContextType {
  user: { id: string; name: string; email: string; role: string } | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
}

// 2️⃣ Criar o contexto (com valor inicial undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3️⃣ Provider — envolve a app e provê os dados
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ao montar, tenta recuperar token do localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const result = await apiPost<{ token: string; user: AuthContextType["user"] }>(
      "/auth/login",
      { email, password }
    );

    if (result.ok && result.data?.token) {
      setToken(result.data.token);
      setUser(result.data.user);
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      return { ok: true };
    }

    return { ok: false, error: result.error || "Erro no login" };
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 4️⃣ Hook customizado — useAuth
// Garante que sempre seja usado dentro do Provider
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>!");
  }
  return context;
}
