"use client";

import { useActionState } from "react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { login, LoginActionState } from "./actions";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const [state, loginAction, pending] = useActionState<
    LoginActionState | undefined,
    FormData
  >(login, undefined);

  return (
    <div className="flex flex-col justify-center items-center h-screen] w-full">
      <div className="mt-">
        <p className="text-2xl font-bold">Faça login para continuar</p>
        <form action={loginAction} className="w-full flex justify-center">
          <div className="w-[350px] mt-20">
            <Label htmlFor="name">Username</Label>
            <Input className="mt-4" name="username" />

            {!state?.success && (
              <p className="text-sm text-red-500">
                {state?.errors?.username || ""}
              </p>
            )}

            <Label className="mt-4" htmlFor="name">
              Password
            </Label>
            <Input type="password" className="mt-4" name="password" />
            {!state?.success && (
              <p className="text-sm text-red-500">
                {state?.errors?.password || ""}
              </p>
            )}

            <Button className="mt-6 w-full" variant="secondary" disabled={pending}>
              {pending && <Spinner />}
              {pending ? "Validando" : "Login"}
            </Button>

            <p className="text-sm text-center mt-5 opacity-70">Não possui uma conta? <span className="text-blue-500">Criar uma</span></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
