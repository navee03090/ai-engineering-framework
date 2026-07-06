import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/lib/auth/routes";
import { AppError } from "@/lib/api/errors";
import { createClient } from "@/lib/supabase/server";

export async function getServerSession() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new AppError(error.message, 500, "AUTH_SESSION_FAILED");
  }

  return data.session;
}

export async function getServerUser() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function requireUser() {
  const user = await getServerUser();

  if (!user) {
    redirect(AUTH_ROUTES.login);
  }

  return user;
}
