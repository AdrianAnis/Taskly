"use client";

import { useState, useTransition, type FormEvent, type JSX } from "react";
import { signIn } from "@/auth/actions";
import { Button } from "@/components/button";
import { TextField } from "@/components/input";

export function LoginForm(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result !== undefined && !result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <div className="flex flex-col gap-4">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="nama@email.com"
          autoComplete="email"
          required
          disabled={isPending}
        />
        <TextField
          id="password"
          name="password"
          type="password"
          label="Kata sandi"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Button type="submit" isLoading={isPending} className="w-full">
          Masuk
        </Button>
        {error === null ? null : (
          <p role="alert" className="text-center text-sm text-danger">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
