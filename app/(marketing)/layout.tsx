import { MarketingFooter } from "@/components/civicai/layout/marketing-footer";
import { MarketingNavbar } from "@/components/civicai/layout/marketing-navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <MarketingNavbar />
      <div className="flex-1">{children}</div>
      <MarketingFooter />
    </div>
  );
}
