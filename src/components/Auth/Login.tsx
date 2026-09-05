"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { CodeXml } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import loginImage from "@/public/login.jpg";
import { authService } from "@/src/services/auth";
import type { ApiErrorResponse } from "@/src/types/auth";
import { useAuthStore } from "@/src/context/useAuth";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Unable to sign in. Please try again.";
  }

  return "Unable to sign in. Please try again.";
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const registered = searchParams.get("registered") === "true";
  const setUser = useAuthStore((s) => s.setUser);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authService.login({ email: email.trim(), password });
      const meResp = await authService.me();
      setUser(meResp.data);

      if (meResp.data.role === "employer") {
        router.replace("/recruiter/dashboard");
      } else if (meResp.data.role === "student") {
        router.replace("/student/profile");
      } else {
        router.replace("/");
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-svh grid-rows-[minmax(13rem,32svh)_1fr] bg-surface-elevated lg:grid-cols-2 lg:grid-rows-1">
      <section
        className="relative min-h-52 overflow-hidden border-b-2 border-primary lg:min-h-svh lg:border-r-2 lg:border-b-0"
        aria-label="Student workspace"
      >
        <Image
          alt="A coding workspace with a monitor and laptop"
          className="object-cover object-center"
          fill
          placeholder="blur"
          preload
          sizes="(max-width: 1023px) 100vw, 50vw"
          src={loginImage}
        />
      </section>

      <div
        className="pointer-events-none absolute top-1/2 left-1/2 hidden size-[4.5rem] -translate-1/2 items-center justify-center bg-primary [clip-path:polygon(25%_7%,75%_7%,100%_50%,75%_93%,25%_93%,0_50%)] lg:flex"
        aria-hidden="true"
      >
        <div className="flex size-[4.05rem] items-center justify-center bg-surface-elevated [clip-path:polygon(25%_7%,75%_7%,100%_50%,75%_93%,25%_93%,0_50%)]">
          <CodeXml className="size-8 text-primary" strokeWidth={1.8} />
        </div>
      </div>

      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex w-full max-w-[35rem] flex-col gap-10">
          <header className="flex flex-col gap-9">
            <Link
              className="flex w-fit items-center gap-3 text-lg font-bold tracking-tight text-foreground"
              href="/"
            >
              <CodeXml className="size-9 text-primary" strokeWidth={2.3} aria-hidden="true" />
              Student Job Portal
            </Link>
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl">
                Welcome back
              </h1>
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                Sign in to continue to your account.
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-7">
            {registered ? (
              <Alert role="status">
                <AlertDescription>
                  Your account was created. You can sign in now.
                </AlertDescription>
              </Alert>
            ) : null}

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel className="text-sm font-semibold" htmlFor="email">
                    Email address
                  </FieldLabel>
                  <Input
                    autoComplete="email"
                    className="h-12 px-4"
                    id="email"
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-sm font-semibold" htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
                    autoComplete="current-password"
                    className="h-12 px-4"
                    id="password"
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={password}
                  />
                </Field>
              </FieldGroup>

              <Button className="h-12 w-full" disabled={isSubmitting} size="lg" type="submit">
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link className="font-semibold text-primary hover:underline" href="/register">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
