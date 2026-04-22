import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { isSupabaseConfigured } from "../services/supabaseClient";

type LoginMode = "signin" | "signup" | "recovery";

export default function Login() {
  const navigate = useNavigate();
  const { user, signIn, signUp, requestPasswordRecovery, resetLocalPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoveryPassword, setRecoveryPassword] = useState("");
  const [mode, setMode] = useState<LoginMode>("signin");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === "signup";
  const isRecoveryMode = mode === "recovery";

  const helperText = useMemo(() => {
    if (isSupabaseConfigured) {
      return isRecoveryMode
        ? "Use seu e-mail para receber um link de recuperacao."
        : "Entre, crie sua conta ou recupere sua senha por e-mail.";
    }

    return isRecoveryMode
      ? "No modo local, a recuperacao so funciona neste mesmo navegador."
      : "Cada conta comeca vazia. Para teste real com recuperacao, use Supabase.";
  }, [isRecoveryMode]);

  const recoveryHint = useMemo(() => {
    if (isSupabaseConfigured) {
      return "Recuperacao recomendada: envio de link por e-mail.";
    }

    return "Recuperacao local: redefinir a senha apenas neste navegador. Em outro dispositivo, a conta nao pode ser restaurada.";
  }, []);

  if (user) {
    return <Navigate to="/" replace />;
  }

  function switchMode(nextMode: LoginMode) {
    setMode(nextMode);
    setErrorMessage(null);
    setInfoMessage(null);
    setRecoveryPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      if (isRecoveryMode) {
        const message = await requestPasswordRecovery(email);
        setInfoMessage(message);
        return;
      }

      if (isRegisterMode) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }

      navigate("/", { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Nao foi possivel autenticar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLocalPasswordReset() {
    setIsSubmitting(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      await resetLocalPassword(email, recoveryPassword);
      setPassword(recoveryPassword);
      setRecoveryPassword("");
      setMode("signin");
      setInfoMessage("Senha local atualizada. Agora voce ja pode entrar com a nova senha.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Nao foi possivel redefinir a senha local."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-shell">
      <section className="login-card">
        <p className="eyebrow">Panora</p>
        <h2>
          {isRecoveryMode
            ? "Recuperar acesso"
            : isRegisterMode
              ? "Criar acesso"
              : "Entrar no workspace"}
        </h2>
        <p className="page-copy">{helperText}</p>
        <p className="login-support-copy">{recoveryHint}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@exemplo.com"
              required
            />
          </label>

          {!isRecoveryMode ? (
            <label className="field">
              <span>Senha</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </label>
          ) : null}

          {!isSupabaseConfigured && isRecoveryMode ? (
            <label className="field">
              <span>Nova senha local</span>
              <input
                type="password"
                value={recoveryPassword}
                onChange={(event) => setRecoveryPassword(event.target.value)}
                placeholder="Defina uma nova senha"
                minLength={6}
                required
              />
            </label>
          ) : null}

          {errorMessage ? <p className="inline-message">{errorMessage}</p> : null}
          {infoMessage ? <p className="inline-message inline-message--info">{infoMessage}</p> : null}

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Processando..."
              : isRecoveryMode
                ? "Continuar recuperacao"
                : isRegisterMode
                  ? "Criar conta"
                  : "Entrar"}
          </button>

          {!isSupabaseConfigured && isRecoveryMode ? (
            <button
              className="ghost-button login-secondary-button"
              type="button"
              onClick={handleLocalPasswordReset}
              disabled={isSubmitting || !email.trim() || recoveryPassword.trim().length < 6}
            >
              Redefinir senha local
            </button>
          ) : null}
        </form>

        <div className="login-links">
          <button className="link-button" type="button" onClick={() => switchMode("signup")}>
            Quero criar uma conta
          </button>

          <button className="link-button" type="button" onClick={() => switchMode("signin")}>
            Ja tenho conta
          </button>

          <button className="link-button" type="button" onClick={() => switchMode("recovery")}>
            Esqueci minha senha
          </button>
        </div>
      </section>
    </div>
  );
}
