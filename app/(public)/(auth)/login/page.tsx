"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginBranding from "@/components/marketing/LoginBranding";
import { login, LoginActionState } from "./actions";

const Login = () => {
  const [state, loginAction, pending] = useActionState<
    LoginActionState | undefined,
    FormData
  >(login, undefined);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const usernameError = state && !state.success ? state.errors.username?.[0] : undefined;
  const passwordError = state && !state.success ? state.errors.password?.[0] : undefined;

  useEffect(() => {
    if (!state || state.success) return;
    if (state.errors.username?.length) {
      usernameRef.current?.focus();
    } else if (state.errors.password?.length) {
      passwordRef.current?.focus();
    }
  }, [state]);

  return (
    <div className="pt-22.5">
      <div className="grid min-h-[calc(100vh-5.625rem)] lg:grid-cols-2">
        <LoginBranding />

        <div className="flex flex-col items-center justify-center px-6 py-12 md:px-12">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <p translate="no" className="font-display text-2xl font-bold lg:hidden">
                pfs
              </p>
              <CardTitle className="font-display text-2xl">
                Faça login
              </CardTitle>
              <CardDescription>
                Acesse seu painel de finanças
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form action={loginAction} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    name="username"
                    autoComplete="username"
                    spellCheck={false}
                    aria-invalid={usernameError ? true : undefined}
                    aria-describedby={usernameError ? "username-error" : undefined}
                    ref={usernameRef}
                  />
                  <div aria-live="polite">
                    {usernameError && (
                      <p id="username-error" className="text-sm text-destructive">
                        {usernameError}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={passwordError ? true : undefined}
                    aria-describedby={passwordError ? "password-error" : undefined}
                    ref={passwordRef}
                  />
                  <div aria-live="polite">
                    {passwordError && (
                      <p id="password-error" className="text-sm text-destructive">
                        {passwordError}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  className="mt-2 w-full"
                  variant="default"
                  disabled={pending}
                >
                  {pending && <Spinner aria-label="Carregando" />}
                  {pending ? "Entrando…" : "Fazer login"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
