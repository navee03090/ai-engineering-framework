import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Building2 className="size-10" />
      </div>
      <h1 className="mt-8 text-6xl font-bold tracking-tight">404</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        This page doesn&apos;t exist. Perhaps you were looking for a government service?
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/">
          <Button>
            <ArrowLeft className="size-4" />
            Back to Home
          </Button>
        </Link>
        <Link href="/assistant">
          <Button variant="outline">Ask CivicAI</Button>
        </Link>
        <Link href="/services">
          <Button variant="outline">Browse Services</Button>
        </Link>
      </div>
    </main>
  );
}
