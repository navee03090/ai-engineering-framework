import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { CivicLanguageProvider } from "@/components/providers/civic-language-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  CIVICAI_FULL_TITLE,
  CIVICAI_MARKETING_TAGLINE,
  CIVICAI_PRODUCT_NAME,
} from "@/lib/civicai/brand";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: CIVICAI_FULL_TITLE,
    template: `%s | ${CIVICAI_PRODUCT_NAME}`,
  },
  description: `${CIVICAI_MARKETING_TAGLINE}. Navigate Pakistan government procedures with confidence.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <ThemeProvider>
          <CivicLanguageProvider>
            <TooltipProvider>
              {children}
              <Toaster richColors closeButton position="top-right" />
            </TooltipProvider>
          </CivicLanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
