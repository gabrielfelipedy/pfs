"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  changePassword,
  ChangePasswordActionState,
  changeUsername,
  ChangeUsernameActionState,
} from "@/app/(main)/profile/actions";

interface Props {
  currentUsername: string;
}

export default function ProfileForms({ currentUsername }: Props) {
  const [usernameState, usernameAction, usernamePending] = useActionState<
    ChangeUsernameActionState | undefined,
    FormData
  >(changeUsername, undefined);

  const [passwordState, passwordAction, passwordPending] = useActionState<
    ChangePasswordActionState | undefined,
    FormData
  >(changePassword, undefined);

  const usernameRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);

  const usernameError =
    usernameState && !usernameState.success
      ? usernameState.errors.username?.[0]
      : undefined;

  const currentPasswordError =
    passwordState && !passwordState.success
      ? passwordState.errors.currentPassword?.[0]
      : undefined;

  const newPasswordError =
    passwordState && !passwordState.success
      ? passwordState.errors.newPassword?.[0]
      : undefined;

  useEffect(() => {
    if (usernameState && !usernameState.success) {
      if (usernameState.errors.username?.length) {
        usernameRef.current?.focus();
      }
    }
  }, [usernameState]);

  useEffect(() => {
    if (passwordState && !passwordState.success) {
      if (passwordState.errors.currentPassword?.length) {
        currentPasswordRef.current?.focus();
      } else if (passwordState.errors.newPassword?.length) {
        newPasswordRef.current?.focus();
      }
    }
  }, [passwordState]);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Alterar nome de usuário
          </CardTitle>
          <CardDescription>
            Escolha um novo nome de usuário para entrar no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={usernameAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Novo usuário</Label>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                spellCheck={false}
                defaultValue={currentUsername}
                aria-invalid={usernameError ? true : undefined}
                aria-describedby={usernameError ? "change-username-error" : undefined}
                ref={usernameRef}
              />
              <div aria-live="polite">
                {usernameError && (
                  <p
                    id="change-username-error"
                    className="text-sm text-destructive"
                  >
                    {usernameError}
                  </p>
                )}
                {usernameState?.success && (
                  <p className="text-sm text-primary">{usernameState.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={usernamePending}
              className="w-fit"
            >
              {usernamePending && <Spinner aria-label="Carregando" />}
              {usernamePending ? "Salvando…" : "Salvar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">
            Alterar senha
          </CardTitle>
          <CardDescription>
            Informe a senha atual e escolha uma nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                aria-invalid={currentPasswordError ? true : undefined}
                aria-describedby={
                  currentPasswordError ? "current-password-error" : undefined
                }
                ref={currentPasswordRef}
              />
              <div aria-live="polite">
                {currentPasswordError && (
                  <p
                    id="current-password-error"
                    className="text-sm text-destructive"
                  >
                    {currentPasswordError}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                aria-invalid={newPasswordError ? true : undefined}
                aria-describedby={
                  newPasswordError ? "new-password-error" : undefined
                }
                ref={newPasswordRef}
              />
              <div aria-live="polite">
                {newPasswordError && (
                  <p id="new-password-error" className="text-sm text-destructive">
                    {newPasswordError}
                  </p>
                )}
                {passwordState?.success && (
                  <p className="text-sm text-primary">{passwordState.message}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              disabled={passwordPending}
              className="w-fit"
            >
              {passwordPending && <Spinner aria-label="Carregando" />}
              {passwordPending ? "Salvando…" : "Alterar senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
