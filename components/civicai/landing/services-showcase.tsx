import Link from "next/link";
import {
  AlertTriangle,
  FileText,
  Trash2,
  Waves,
  type LucideIcon,
} from "lucide-react";

import { AnimatedCard } from "@/components/civicai/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPopularServices } from "@/lib/civicai/data/services";

const ICON_MAP: Record<string, LucideIcon> = {
  Trash2,
  AlertTriangle,
  Waves,
  Recycle: FileText,
  Factory: FileText,
  Biohazard: FileText,
  Droplets: FileText,
  Package: FileText,
  Wind: FileText,
  TreePine: FileText,
  Sparkles: FileText,
  MessageSquare: FileText,
};

export function ServicesShowcase() {
  const services = getPopularServices();

  return (
    <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Environmental Services
            </h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              12 waste and environmental services with evidence checklists and authority guidance.
            </p>
          </div>
          <Link href="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? FileText;
            return (
              <AnimatedCard key={service.id} delay={i * 0.08}>
                <Card className="h-full hover:shadow-md">
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
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-medium">{service.fee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response</span>
                      <span className="font-medium">{service.processingTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
