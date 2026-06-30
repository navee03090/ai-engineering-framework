import { SiteHeader } from "@/components/layout/site-header";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
