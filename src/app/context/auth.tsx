import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../services/supabaseClient";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  requestPasswordRecovery: (email: string) => Promise<string>;
  resetLocalPassword: (email: string, nextPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_SESSION_KEY = "panora.local-session";
const LEGACY_LOCAL_SESSION_KEY = "panaro.local-session";
const LOCAL_ACCOUNTS_KEY = "panora.local-accounts";
const LEGACY_LOCAL_ACCOUNTS_KEY = "panaro.local-accounts";

type LocalUser = Pick<User, "id" | "email">;
type LocalAccount = LocalUser & { password: string };

function getStoredLocalUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedUser =
    window.localStorage.getItem(LOCAL_SESSION_KEY) ??
    window.localStorage.getItem(LEGACY_LOCAL_SESSION_KEY);

  if (!storedUser) {
    return null;
  }

  return JSON.parse(storedUser) as LocalUser;
}

function getStoredAccounts() {
  if (typeof window === "undefined") {
    return [] as LocalAccount[];
  }

  const storedAccounts =
    window.localStorage.getItem(LOCAL_ACCOUNTS_KEY) ??
    window.localStorage.getItem(LEGACY_LOCAL_ACCOUNTS_KEY);

  if (!storedAccounts) {
    return [] as LocalAccount[];
  }

  try {
    return JSON.parse(storedAccounts) as LocalAccount[];
  } catch {
    return [] as LocalAccount[];
  }
}

function saveStoredAccounts(accounts: LocalAccount[]) {
  window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  window.localStorage.removeItem(LEGACY_LOCAL_ACCOUNTS_KEY);
}

function migrateLegacyAuthStorage() {
  if (typeof window === "undefined") {
    return;
  }

  const legacySession = window.localStorage.getItem(LEGACY_LOCAL_SESSION_KEY);
  const legacyAccounts = window.localStorage.getItem(LEGACY_LOCAL_ACCOUNTS_KEY);

  if (legacySession && !window.localStorage.getItem(LOCAL_SESSION_KEY)) {
    window.localStorage.setItem(LOCAL_SESSION_KEY, legacySession);
  }

  if (legacyAccounts && !window.localStorage.getItem(LOCAL_ACCOUNTS_KEY)) {
    window.localStorage.setItem(LOCAL_ACCOUNTS_KEY, legacyAccounts);
  }

  if (legacySession) {
    window.localStorage.removeItem(LEGACY_LOCAL_SESSION_KEY);
  }

  if (legacyAccounts) {
    window.localStorage.removeItem(LEGACY_LOCAL_ACCOUNTS_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (isSupabaseConfigured) {
      return null;
    }

    return getStoredLocalUser() as User | null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      migrateLegacyAuthStorage();
    }
  }, []);

  useEffect(() => {
    const client = supabase;

    if (!client || !isSupabaseConfigured) {
      return;
    }

    const authClient = client.auth;

    async function getSession() {
      const { data, error } = await authClient.getSession();

      if (error) {
        console.error("Erro ao buscar sessão:", error.message);
      }

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    void getSession();

    const { data: listener } = authClient.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      signIn: async (email: string, password: string) => {
        if (!supabase || !isSupabaseConfigured) {
          const accounts = getStoredAccounts();
          const account = accounts.find(
            (current) => (current.email ?? "").toLowerCase() === email.toLowerCase()
          );

          if (!account || account.password !== password) {
            throw new Error("Conta local não encontrada ou senha inválida.");
          }

          const localUser: LocalUser = {
            id: account.id,
            email: account.email,
          };

          window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localUser));
          setUser(localUser as User);
          setSession(null);
          return;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      },
      signUp: async (email: string, password: string) => {
        if (!supabase || !isSupabaseConfigured) {
          const accounts = getStoredAccounts();
          const existingAccount = accounts.find(
            (current) => (current.email ?? "").toLowerCase() === email.toLowerCase()
          );

          if (existingAccount) {
            throw new Error("Já existe uma conta local com este e-mail.");
          }

          const localUser: LocalUser = {
            id: crypto.randomUUID(),
            email,
          };

          saveStoredAccounts([...accounts, { ...localUser, password }]);
          window.localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(localUser));
          setUser(localUser as User);
          setSession(null);
          return;
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
      },
      requestPasswordRecovery: async (email: string) => {
        if (!email.trim()) {
          throw new Error("Informe o e-mail para recuperar o acesso.");
        }

        if (!supabase || !isSupabaseConfigured) {
          const accounts = getStoredAccounts();
          const account = accounts.find(
            (current) => (current.email ?? "").toLowerCase() === email.toLowerCase()
          );

          if (!account) {
            throw new Error(
              "Nao encontramos essa conta neste navegador. Se a conta foi criada em outro dispositivo, sera preciso usar o Supabase para ter recuperacao real por e-mail."
            );
          }

          return "Conta local encontrada neste navegador. Voce pode definir uma nova senha abaixo.";
        }

        const origin = typeof window !== "undefined" ? window.location.origin : undefined;
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: origin ? `${origin}/login` : undefined,
        });

        if (error) throw error;

        return "Enviamos um link de recuperacao para o seu e-mail.";
      },
      resetLocalPassword: async (email: string, nextPassword: string) => {
        if (supabase && isSupabaseConfigured) {
          throw new Error(
            "A redefinicao direta de senha local so deve ser usada no modo local. No Supabase, use o link enviado por e-mail."
          );
        }

        const normalizedEmail = email.trim().toLowerCase();
        const trimmedPassword = nextPassword.trim();

        if (!normalizedEmail) {
          throw new Error("Informe o e-mail da conta local.");
        }

        if (trimmedPassword.length < 6) {
          throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
        }

        const accounts = getStoredAccounts();
        const accountIndex = accounts.findIndex(
          (current) => (current.email ?? "").toLowerCase() === normalizedEmail
        );

        if (accountIndex < 0) {
          throw new Error("Conta local nao encontrada neste navegador.");
        }

        const updatedAccounts = [...accounts];
        updatedAccounts[accountIndex] = {
          ...updatedAccounts[accountIndex],
          password: trimmedPassword,
        };

        saveStoredAccounts(updatedAccounts);
      },
      signOut: async () => {
        if (!supabase || !isSupabaseConfigured) {
          window.localStorage.removeItem(LOCAL_SESSION_KEY);
          setUser(null);
          setSession(null);
          return;
        }

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth precisa estar dentro de AuthProvider");
  }

  return context;
}
