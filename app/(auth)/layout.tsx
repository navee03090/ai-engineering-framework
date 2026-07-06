import Link from "next/link";

import { CIVICAI_FULL_TITLE, CIVICAI_MARKETING_TAGLINE } from "@/lib/civicai/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <Link className="text-lg font-semibold hover:underline" href="/">
          {CIVICAI_FULL_TITLE}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">
          {CIVICAI_MARKETING_TAGLINE}
        </p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
