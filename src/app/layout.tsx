import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
// import ScrollToTopComponent from "@/components/providers/ScrollToTop";

import { Nunito_Sans, Crimson_Text, Fredoka } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import AppProvider from "@/components/providers/AppProvider";
import { Toaster } from "@/components/ui/sonner";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FORECLOSURE GOLD",
  description: "Premium Foreclosure Leads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} ${crimsonText.variable} ${fredoka.variable}`}
      >
        <SmoothScrollProvider>
          <AuthProvider>
          <AppProvider>
            {children}

            <Toaster />
          </AppProvider>
        </AuthProvider>
          {/* <ScrollToTopComponent /> */}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
