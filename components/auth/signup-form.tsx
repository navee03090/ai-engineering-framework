"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { signUpAction, type AuthActionState } from "@/app/(auth)/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: AuthActionState = {};

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const isAuthoritySignup = next?.startsWith("/authority");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
        <CardDescription>
          {isAuthoritySignup
            ? "Register your municipal email to access the EcoMind AI authority portal."
            : "Register to report environmental issues and track your incident reports."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {next ? <input type="hidden" name="redirectTo" value={next} /> : null}
          {state.error ? (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}
          {isAuthoritySignup ? (
            <Alert>
              <AlertDescription className="text-sm">
                Use the email on your authority allowlist (e.g.{" "}
                <strong>naveedcr308@gmail.com</strong>). You choose the password — at
                least 8 characters. After signup you go straight to the authority
                dashboard.
              </AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={isAuthoritySignup ? "naveedcr308@gmail.com" : "you@example.com"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="At least 8 characters — you choose this"
            />
            <p className="text-xs text-muted-foreground">
              Pick any password you will remember. There is no preset authority
              password — you create it here once.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already registered?{" "}
            <Link
              className="font-medium text-foreground hover:underline"
              href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
            >
              Sign in
            </Link>
          </p>
          {!isAuthoritySignup ? (
            <p className="text-center text-sm text-muted-foreground">
              Municipal staff?{" "}
              <Link
                className="font-medium text-foreground hover:underline"
                href="/signup?next=/authority/dashboard"
              >
                Authority signup
              </Link>
            </p>
          ) : null}
        </CardFooter>
      </form>
    </Card>
  );
}
