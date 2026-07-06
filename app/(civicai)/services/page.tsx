import { Suspense } from "react";

import { ServicesBrowser } from "@/components/civicai/services/services-browser";

export const metadata = {
  title: "Government Services",
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">Loading services...</div>
      }
    >
      <ServicesBrowser />
    </Suspense>
  );
}
