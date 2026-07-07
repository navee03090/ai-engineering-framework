import { redirect } from "next/navigation";

import { AppError } from "@/lib/api/errors";
import { AUTH_ROUTES } from "@/lib/auth/routes";
import { getServerUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

function getAllowlist(): Set<string> {
  const raw = process.env.AUTHORITY_EMAIL_ALLOWLIST ?? "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isEmailAllowlisted(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAllowlist().has(email.toLowerCase());
}

/** Inbox(es) that receive new citizen report notifications (allowlist + alert email). */
export function getAuthorityNotificationEmails(): string[] {
  const emails = new Set<string>();

  for (const email of getAllowlist()) {
    emails.add(email);
  }

  const alertEmail = process.env.CIVIC_ALERT_EMAIL?.trim().toLowerCase();
  if (alertEmail) {
    emails.add(alertEmail);
  }

  return [...emails];
}

export async function getAuthorityProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function isAuthorityUser(
  userId: string,
  email?: string | null
): Promise<boolean> {
  const profile = await getAuthorityProfile(userId);
  if (profile?.role === "admin") {
    return true;
  }

  const resolvedEmail = email ?? profile?.email;
  return isEmailAllowlisted(resolvedEmail);
}

export async function requireAuthority() {
  const user = await getServerUser();

  if (!user) {
    redirect(AUTH_ROUTES.login);
  }

  const allowed = await isAuthorityUser(user.id, user.email);
  if (!allowed) {
    redirect("/dashboard");
  }

  return user;
}

export async function assertAuthorityApi(user: {
  id: string;
  email?: string | null;
}): Promise<void> {
  const allowed = await isAuthorityUser(user.id, user.email);
  if (!allowed) {
    throw new AppError("Authority access required", 403, "FORBIDDEN");
  }
}
