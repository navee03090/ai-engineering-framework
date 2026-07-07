"use server";

import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/auth/routes";
import { AppError } from "@/lib/api/errors";
import { signInSchema, signUpSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";

export type AuthActionState = {
  error?: string;
};

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const input = signUpSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: formData.get("fullName") || undefined,
    });

    await authService.signUp(input);

    const redirectTo = formData.get("redirectTo")?.toString().trim();
    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      redirect(redirectTo);
    }

    redirect(AUTH_ROUTES.dashboard);
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const input = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await authService.signIn(input);

    const redirectTo = formData.get("redirectTo")?.toString().trim();
    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
      redirect(redirectTo);
    }

    redirect(AUTH_ROUTES.dashboard);
  } catch (error) {
    if (error instanceof AppError) {
      return { error: error.message };
    }

    throw error;
  }
}

export async function signOutAction() {
  await authService.signOut();
  redirect(AUTH_ROUTES.login);
}
