import { AuthorityShell } from "@/components/civicai/authority/authority-shell";import { requireAuthority } from "@/lib/auth/authority";

export default async function AuthorityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthority();

  return <AuthorityShell userEmail={user.email}>{children}</AuthorityShell>;
}
