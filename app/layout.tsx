import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Wanderly Travel Agency",
  description: "Modern travel agency offering curated packages and bespoke itineraries.",
  keywords: ["travel", "packages", "tours", "vacation"],
  openGraph: {
    title: "Wanderly Travel Agency",
    description: "Discover curated travel packages with flexible itineraries.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 antialiased">
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
