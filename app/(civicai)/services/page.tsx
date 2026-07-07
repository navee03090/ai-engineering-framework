import { Suspense } from "react";

import { ServicesBrowser } from "@/components/civicai/services/services-browser";

export const metadata = {
  title: "Environmental Services",
  description: "Browse waste and environmental services with authority guidance.",
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
