import { Button } from "@/assets/components/ui/button";
import { Input } from "@/assets/components/ui/input";
import { Label } from "@/assets/components/ui/label";
import { LogoGDG } from "@/assets/images/LogoGDG";
import { cn } from "@/assets/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LoginPage({
  className,
  ...props
}: React.ComponentProps<"main">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user && router.isReady) {
      const destination =
        typeof router.query.next === "string" &&
        router.query.next.startsWith("/admin")
          ? router.query.next
          : "/admin";
      void router.replace(
        isAdmin
          ? destination
          : `/unauthorized?next=${encodeURIComponent(destination)}`,
      );
    }
  }, [authLoading, user, isAdmin, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setError(
        "E-mail ou senha inválidos. Confira os dados e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isSubmitting = loading || authLoading || Boolean(user);

  return (
    <>
      <Head>
        <title>Entrar no painel | GDG Uberlândia</title>
      </Head>
      <main
        className={cn(
          "admin-shell relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-100 px-4 py-8 text-slate-950 sm:px-6 lg:px-8",
          className,
        )}
        {...props}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-400"
        />
        <div
          aria-hidden="true"
          className="absolute -left-28 -top-28 size-80 rounded-full bg-blue-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-32 -right-24 size-96 rounded-full bg-indigo-200/30 blur-3xl"
        />

        <section className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/40 lg:min-h-[590px] lg:grid-cols-[1.05fr_1fr]">
          <aside className="relative hidden overflow-hidden bg-[#071a3a] p-10 text-white lg:flex lg:flex-col">
            <div
              aria-hidden="true"
              className="absolute -right-28 -top-24 size-72 rounded-full border-[48px] border-blue-500/15"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-20 size-64 rounded-full bg-blue-600/15 blur-2xl"
            />

            <div className="relative">
              <LogoGDG inverted width={210} height={48} />
            </div>

            <div className="relative mt-auto max-w-sm pb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-950/30">
                <ShieldCheck className="size-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                Área administrativa
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight">
                Gestão do DevFest em um só lugar.
              </h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Organize palestrantes, programação, patrocinadores e todas as
                experiências do evento com segurança.
              </p>
            </div>

            <p className="relative text-xs text-slate-400">
              Acesso exclusivo para pessoas administradoras.
            </p>
          </aside>

          <div className="flex min-w-0 flex-col bg-white p-6 sm:p-10 lg:p-12">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <LogoGDG width={178} height={42} color="#071a3a" />
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <ShieldCheck className="size-5" />
              </div>
            </div>

            <div className="my-auto">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Painel administrativo
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Boas-vindas
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Entre com suas credenciais para acessar a gestão do evento.
                </p>
              </div>

              <form onSubmit={handleLogin} className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700"
                  >
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nome@exemplo.com"
                      required
                      autoComplete="email"
                      autoFocus
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      aria-invalid={Boolean(error)}
                      className="h-12 border-slate-300 bg-white pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      aria-invalid={Boolean(error)}
                      className="h-12 border-slate-300 bg-white px-10 text-slate-900 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label={
                        showPassword ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-700"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="h-12 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader2 className="size-4 animate-spin" />}
                  {isSubmitting ? "Entrando..." : "Entrar no painel"}
                </Button>
              </form>
            </div>

            <div className="mt-10 border-t border-slate-100 pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
              >
                <ArrowLeft className="size-4" />
                Voltar para o site
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
