import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/TopNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import SessionProviders from "@/components/providers/SessionProviders";
import { QueryProvider } from "./providers";
import I18nProvider from "@/components/providers/I18nProvider";
import SplashScreen from "@/components/ui/SplashScreen";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import LoginPopup from "@/components/ui/LoginPopup";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  applicationName: "Krafted Royale",
  title: "Krafted Furniture | Luxury Handcrafted Furniture",
  description:
    "Experience the epitome of luxury with Krafted Furniture. Handcrafted, premium designs for your sophisticated home.",
  manifest: "/manifest.webmanifest",
  keywords: [
    "luxury furniture",
    "handcrafted",
    "premium decor",
    "gold furniture",
    "modern interior",
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Krafted Royale",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [{ url: "/icons/icon-192.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">


      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground selection:bg-gold/30 selection:text-gold flex flex-col",
          inter.variable,
          playfair.variable,
          roboto_mono.variable
        )}
      >
        <SessionProviders>
          <I18nProvider>
            <QueryProvider>
              <SplashScreen />
              <Navbar />
              <main className="flex-grow">{children}</main>
              <ConditionalFooter />
              <WhatsAppButton />
              <LoginPopup />
            </QueryProvider>
          </I18nProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
