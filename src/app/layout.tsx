import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { LoaderOverlay } from "@/components/LoaderOverlay";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://nutzh.top"),
  title: {
    default: "Nutzh Blog – Offensive Security Writeups & Projects",
    template: "%s | Nutzh Blog",
  },
  description: "Nutzh blog",
};

export const viewport: Viewport = {
  themeColor: "#00ff00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="__variable_1e4310 __variable_5899e0 __variable_1a1e6c __variable_63a070 __variable_09d22a">
      <head>
        <link rel="stylesheet" href="/mc/theme.css" />
        <link rel="stylesheet" href="/mc/theme-post.css" />
        <link rel="preload" as="image" href="/mc/images/dog.gif" type="image/gif" />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <div className="dot-overlay" />
        <Suspense fallback={null}>
          <LoaderOverlay />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
