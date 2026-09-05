"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { CodeXml } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import registerImage from "@/public/register.jpg";
import { authService } from "@/src/services/auth";
import type { ApiErrorResponse } from "@/src/types/auth";

type AccountRole = "student" | "employer";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Unable to create your account. Please try again.";
  }

  return "Unable to create your account. Please try again.";
}

export default function Register() {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      email: email.trim(),
      password,
      full_name: fullName.trim(),
    };

    setIsSubmitting(true);
    try {
      if (role === "student") {
        await authService.registerStudent(payload);
      } else {
        await authService.registerEmployer(payload);
      }

      const query = new URLSearchParams({
        registered: "true",
        email: payload.email,
      });
      router.replace(`/login?${query.toString()}`);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative grid min-h-svh grid-rows-[minmax(13rem,30svh)_1fr] bg-surface-elevated lg:grid-cols-2 lg:grid-rows-1">
      <section
        className="relative min-h-52 overflow-hidden border-b-2 border-primary lg:min-h-svh lg:border-r-2 lg:border-b-0"
        aria-label="Student working at a coding desk"
      >
        <Image
          alt="A student working at a monitor in a collaborative office"
          className="object-cover object-center"
          fill
          placeholder="blur"
          preload
          sizes="(max-width: 1023px) 100vw, 50vw"
          src={registerImage}
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

      <section className="flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20">
        <div className="flex w-full max-w-[37rem] flex-col gap-7">
          <header className="flex flex-col gap-7">
            <Link
              className="flex w-fit items-center gap-3 text-lg font-bold tracking-tight text-foreground"
              href="/"
            >
              <CodeXml className="size-9 text-primary" strokeWidth={2.3} aria-hidden="true" />
              Student Job Portal
            </Link>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-[-0.035em] text-foreground sm:text-4xl">
                Create your account
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Join as a student looking for work or an employer hiring talent.
              </p>
            </div>
          </header>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
            <FieldGroup className="gap-5">
              <FieldSet className="gap-2">
                <FieldLegend className="text-sm font-semibold" variant="label">
                  Account type
                </FieldLegend>
                <ToggleGroup
                  aria-label="Account type"
                  className="grid w-full grid-cols-2 gap-0"
                  onValueChange={(value) => value[0] && setRole(value[0] as AccountRole)}
                  spacing={0}
                  value={[role]}
                  variant="outline"
                >
                  <ToggleGroupItem className="h-12 justify-start gap-3 px-5" value="student">
                    <span
                      className="flex size-5 items-center justify-center rounded-full border border-border-strong group-aria-pressed/toggle:border-primary"
                      aria-hidden="true"
                    >
                      <span className="size-2.5 rounded-full bg-primary opacity-0 group-aria-pressed/toggle:opacity-100" />
                    </span>
                    Student
                  </ToggleGroupItem>
                  <ToggleGroupItem className="h-12 justify-start gap-3 px-5" value="employer">
                    <span
                      className="flex size-5 items-center justify-center rounded-full border border-border-strong group-aria-pressed/toggle:border-primary"
                      aria-hidden="true"
                    >
                      <span className="size-2.5 rounded-full bg-primary opacity-0 group-aria-pressed/toggle:opacity-100" />
                    </span>
                    Employer
                  </ToggleGroupItem>
                </ToggleGroup>
              </FieldSet>

              <Field>
                <FieldLabel className="text-sm font-semibold" htmlFor="fullName">
                  Full name
                </FieldLabel>
                <Input
                  autoComplete="name"
                  className="h-12 px-4"
                  id="fullName"
                  name="fullName"
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  type="text"
                  value={fullName}
                />
              </Field>

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

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel className="text-sm font-semibold" htmlFor="password">
                    Password
                  </FieldLabel>
                  <Input
                    autoComplete="new-password"
                    className="h-12 px-4"
                    id="password"
                    minLength={8}
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    type="password"
                    value={password}
                  />
                  <FieldDescription>Use at least 8 characters.</FieldDescription>
                </Field>

                <Field data-invalid={error === "Passwords do not match."}>
                  <FieldLabel className="text-sm font-semibold" htmlFor="confirmPassword">
                    Confirm password
                  </FieldLabel>
                  <Input
                    aria-invalid={error === "Passwords do not match."}
                    autoComplete="new-password"
                    className="h-12 px-4"
                    id="confirmPassword"
                    minLength={8}
                    name="confirmPassword"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    type="password"
                    value={confirmPassword}
                  />
                </Field>
              </FieldGroup>
            </FieldGroup>

            <Button className="h-12 w-full" disabled={isSubmitting} size="lg" type="submit">
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-semibold text-primary hover:underline" href="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
