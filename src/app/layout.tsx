import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import ScrollToTopComponent from "@/components/providers/ScrollToTop";

import { Nunito_Sans, Crimson_Text, Fredoka } from "next/font/google";

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
  title: "Boekerello",
  description: "Their Imagination. Their Adventure. Their Story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunitoSans.variable} ${crimsonText.variable} ${fredoka.variable} ${nunitoSans.className}`}
      >
        <SmoothScrollProvider>
          {children}
          <ScrollToTopComponent />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
