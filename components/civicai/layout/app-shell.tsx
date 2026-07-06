"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Clock,
  FileText,
  History,
  LayoutDashboard,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Upload,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { GoogleMapsProvider } from "@/components/civicai/maps/google-maps-provider";
import { useCivicLanguage } from "@/components/providers/civic-language-provider";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { CIVIC_LANGUAGE_LABELS, type CivicLanguage } from "@/lib/civicai/language";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/services", label: "Services", icon: Building2 },
  { href: "/upload", label: "Upload Document", icon: Upload },
  { href: "/checklist", label: "Checklist", icon: FileText },
  { href: "/reports/demo", label: "Reports", icon: FileText },
  { href: "/history", label: "History", icon: History },
];

const SECONDARY_NAV = [{ href: "/settings", label: "Settings", icon: Settings }];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useHasMounted();
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function AppSidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {MAIN_NAV.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={
                    pathname === item.href || pathname.startsWith(`${item.href}/`)
                  }
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {SECONDARY_NAV.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={pathname === item.href}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}

function LanguageToggle() {
  const { language, setLanguage } = useCivicLanguage();

  return (
    <Select
      value={language}
      onValueChange={(v) => setLanguage((v ?? "en") as CivicLanguage)}
    >
      <SelectTrigger className="h-8 w-[110px]" aria-label="Select language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{CIVIC_LANGUAGE_LABELS.en}</SelectItem>
        <SelectItem value="ur">اردو</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-border/60">
        <SidebarHeader className="border-b border-border/60 p-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="size-4" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold">CivicAI</span>
              <span className="text-[10px] text-muted-foreground">
                Citizen Assistant
              </span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <AppSidebarNav />
        </SidebarContent>
        <SidebarFooter className="border-t border-border/60 p-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2 group-data-[collapsible=icon]:justify-center">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
              AI Online
            </span>
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="flex min-h-svh flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <SidebarTrigger />
          <div className="flex flex-1 items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Transparent government navigation
            </span>
          </div>
          <ThemeToggle />
          <LanguageToggle />
          <Link href="/assistant">
            <Button size="sm" className="hidden sm:inline-flex">
              <Sparkles className="size-4" />
              Ask AI
            </Button>
          </Link>
        </header>
        <main className="flex-1">
          <GoogleMapsProvider>{children}</GoogleMapsProvider>
        </main>
      </div>
    </SidebarProvider>
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
        "mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
