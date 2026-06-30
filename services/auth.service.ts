import { createClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/errors";
import type { SignInInput, SignUpInput } from "@/lib/validations";

export const authService = {
  async signUp(input: SignUpInput) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName ?? null,
        },
      },
    });

    if (error) {
      throw new AppError(error.message, 400, "AUTH_SIGNUP_FAILED");
    }

    return {
      user: data.user,
      session: data.session,
    };
  },

  async signIn(input: SignInInput) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      throw new AppError(error.message, 401, "AUTH_SIGNIN_FAILED");
    }

    return {
      user: data.user,
      session: data.session,
    };
  },

  async signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AppError(error.message, 400, "AUTH_SIGNOUT_FAILED");
    }

    return { success: true };
  },

  async getSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new AppError(error.message, 500, "AUTH_SESSION_FAILED");
    }

    return data.session;
  },

  async getUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new AppError(error.message, 401, "AUTH_USER_FAILED");
    }

    return data.user;
  },
};
