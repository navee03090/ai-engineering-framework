import { Badge } from "@/components/ui/badge";
import { NotificationPanel } from "@/components/notifications/notification-panel";
import { requireUser } from "@/lib/auth/session";
import { notificationService } from "@/services/notification.service";

export default async function NotificationsPage() {
  const user = await requireUser();
  const status = notificationService.getStatus();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-10">
      <section className="space-y-2">
        <Badge>Email notifications</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">Email notifications</h1>
        <p className="text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user.email}</span>
        </p>
      </section>
      <NotificationPanel initialStatus={status} />
    </main>
  );
}
