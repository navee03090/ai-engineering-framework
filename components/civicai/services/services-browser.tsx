"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Baby,
  BookOpen,
  Building2,
  Car,
  FileText,
  Heart,
  IdCard,
  Landmark,
  MapPin,
  Receipt,
  Search,
  Shield,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { OfficeMap } from "@/components/civicai/maps/office-map";
import { PageHeader } from "@/components/civicai/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GOVERNMENT_SERVICES, SERVICE_CATEGORIES } from "@/lib/civicai/data/services";
import { getOfficeLocation } from "@/lib/civicai/office-locations";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Car,
  BookOpen,
  IdCard,
  Baby,
  FileText,
  Heart,
  MapPin,
  Receipt,
  Truck,
  Building2,
  Zap,
  Shield,
  Landmark,
};

export function ServicesBrowser() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeId = selectedId ?? searchParams.get("highlight");

  const selectedLocation = activeId ? getOfficeLocation(activeId) : null;

  const filtered = useMemo(() => {
    return GOVERNMENT_SERVICES.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.department.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || s.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Government Services"
        description="Browse 13 essential Pakistan government services with official requirements."
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="pl-9"
            aria-label="Search government services"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                category === cat.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-muted"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service, i) => {
          const Icon = ICON_MAP[service.icon] ?? FileText;
          return (
            <AnimatedCard key={service.id} delay={i * 0.05}>
              <Card
                className={cn(
                  "h-full cursor-pointer transition-shadow hover:shadow-md",
                  activeId === service.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedId(service.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    {service.popular && <Badge>Popular</Badge>}
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <CardDescription>{service.department}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Fee</p>
                      <p className="font-medium">{service.fee}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="font-medium">{service.processingTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      Required Documents
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {service.documents.slice(0, 3).map((d) => (
                        <Badge key={d} variant="secondary" className="text-xs">
                          {d}
                        </Badge>
                      ))}
                      {service.documents.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{service.documents.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/assistant?q=${encodeURIComponent(`How do I apply for ${service.name}?`)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-sm font-medium text-primary hover:underline">
                      Get AI guidance →
                    </span>
                  </Link>
                </CardContent>
              </Card>
            </AnimatedCard>
          );
        })}
      </div>

      {selectedLocation && (
        <div className="mt-8">
          <OfficeMap
            location={selectedLocation}
            title={`Where to visit — ${GOVERNMENT_SERVICES.find((s) => s.id === activeId)?.name}`}
            height={320}
          />
        </div>
      )}

      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No services match your search.
        </p>
      )}
    </div>
  );
}
