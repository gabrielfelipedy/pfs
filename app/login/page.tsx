"use client";

import { useActionState } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { login, LoginActionState } from "./actions";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const [state, loginAction, pending] = useActionState<
    LoginActionState | undefined,
    FormData
  >(login, undefined);

  return (
    <div className="flex flex-col justify-center items-center h-screen mt-[-60] w-full">
      <p className="text-2xl font-bold">Faça login para continuar</p>
      <form
        action={loginAction}
        className="rounded-lg p-4 max-w-[5
  700px] mt-6"
      >
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

        <Button className="mt-6 w-full" disabled={pending}>
          {pending && <Spinner />}
          {pending ? "Validando" : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;