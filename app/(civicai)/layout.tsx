import { requireUser } from "@/lib/auth/session";
import { AppShell } from "@/components/civicai/layout/app-shell";

export default async function CivicAiAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <AppShell>{children}</AppShell>;
}
