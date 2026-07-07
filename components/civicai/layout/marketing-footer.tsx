import Link from "next/link";
import { Leaf, Code2, Mail, Share2 } from "lucide-react";

const FOOTER_LINKS = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/services", label: "Environmental Services" },
    { href: "/assistant", label: "AI Assistant" },
  ],
  Resources: [
    { href: "/faq", label: "FAQ" },
    { href: "/docs", label: "Documentation" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
  Platform: [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/upload", label: "Upload Waste Photo" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="size-5" aria-hidden />
              </div>
              <span className="text-xl font-bold">EcoMind AI</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              AI that doesn&apos;t just report waste—it predicts, prioritizes, and
              coordinates cleanup. Helping citizens and municipalities build cleaner
              cities across Pakistan.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="mailto:hello@ecomind.pk"
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Share"
              >
                <Share2 className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                aria-label="GitHub"
              >
                <Code2 className="size-4" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EcoMind AI. Built for cleaner Pakistan.
          </p>
          <p className="text-xs text-muted-foreground">
            Mock environmental data for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
