import { Badge } from "@/components/ui/badge";
import { UploadPanel } from "@/components/upload/upload-panel";
import { requireUser } from "@/lib/auth/session";

export default async function UploadsPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Phase 11 — Uploads</Badge>
          <Badge variant="secondary">Supabase Storage</Badge>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">File uploads</h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
      </section>
      <UploadPanel />
    </main>
  );
}
