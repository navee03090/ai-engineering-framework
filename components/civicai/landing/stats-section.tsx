import { AnimatedCard } from "@/components/civicai/shared";
import { PLATFORM_STATS } from "@/lib/civicai/data/stats";

export function StatsSection() {
  return (
    <section className="border-y border-border/60 bg-primary/5 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_STATS.map((stat, i) => (
          <AnimatedCard key={stat.label} delay={i * 0.08}>
            <div className="text-center">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl civic-gradient-text">
                {stat.value}
              </p>
              <p className="mt-1 font-medium">{stat.label}</p>
              {stat.change && (
                <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
              )}
            </div>
          </AnimatedCard>
        ))}
      </div>
    </section>
  );
}
