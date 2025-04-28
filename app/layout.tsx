import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { cn } from "@/utils";
import { SportProvider } from "@/context/SportContext";

export const metadata: Metadata = {
  title: "PeakForm",
  description: "Track and optimize your athletic performance through emotional intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head />
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex flex-col h-screen overflow-hidden"
        )}
      >
        <main className="flex-grow flex flex-col h-full">
          <SportProvider>
            {children}
          </SportProvider>
        </main>
      </body>
    </html>
  );
}
