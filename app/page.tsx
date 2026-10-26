"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";


export default function Home() {
  const [state, action, pending] = useActionState(login, undefined);
  const emailError = state?.errors?.email?.[0];
  const passwordError = state?.errors?.password?.[0];
  const message = state?.message;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar a CAO Dashboard</CardTitle>
          <CardDescription>Aceso a los excels e informacion de la CAO</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <Input name="email" type="email" placeholder="you@company.com" required />
            {emailError && <p>{emailError}</p>}
            <Input name="password" type="password" placeholder="Password" required minLength={8} />
            {passwordError && <p>{passwordError}</p>}
            {message && <p>{message}</p>}
            <Button type="submit" disabled={pending}>{pending ? "Entrando..." : "Entrar"}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
