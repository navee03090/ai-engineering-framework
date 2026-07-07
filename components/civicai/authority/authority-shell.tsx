"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, FileText, LayoutDashboard, Shield } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { CIVICAI_PRODUCT_NAME } from "@/lib/civicai/brand";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/authority/dashboard", label: "Overview", icon: LayoutDashboard },
];

export function AuthorityShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Shield className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">{CIVICAI_PRODUCT_NAME}</p>
              <p className="text-xs text-muted-foreground">Authority Portal</p>
            </div>
          </div>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {userEmail ? (
              <span className="hidden max-w-[180px] truncate text-xs text-muted-foreground sm:inline">
                {userEmail}
              </span>
            ) : null}
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="gap-2">
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Citizen view</span>
              </Button>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 gap-2">{children}</div> : null}
    </div>
  );
}

export function ReporterBadge({
  email,
  name,
}: {
  email: string | null;
  name: string | null;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <FileText className="size-3" />
      {name ?? email ?? "Anonymous citizen"}
    </span>
  );
}
