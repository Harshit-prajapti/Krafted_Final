import type { Metadata } from "next";
import { Playfair_Display, Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/TopNavbar";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import SessionProviders from "@/components/providers/SessionProviders";
import { QueryProvider } from "./providers";
import I18nProvider from "@/components/providers/I18nProvider";
import { PT_Serif } from 'next/font/google';
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
  title: "Krafted Furniture | Luxury Handcrafted Furniture",
  description:
    "Experience the epitome of luxury with Krafted Furniture. Handcrafted, premium designs for your sophisticated home.",
  keywords: [
    "luxury furniture",
    "handcrafted",
    "premium decor",
    "gold furniture",
    "modern interior",
  ],
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

