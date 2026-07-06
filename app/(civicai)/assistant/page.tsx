import { Suspense } from "react";

import { AssistantChat } from "@/components/civicai/assistant/chat-interface";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "AI Assistant",
};

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      }
    >
      <AssistantChat />
    </Suspense>
  );
}
