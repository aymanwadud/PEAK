import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { cn } from "@/utils";
// Import the sidebar (we'll handle state later)
// import ChatHistorySidebar from "@/components/ChatHistorySidebar";

export const metadata: Metadata = {
  title: "MindFlow",
  description: "A Next.js starter using Hume AI's Empathic Voice Interface",
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
        <Nav />
        <main className="flex-grow flex flex-col h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
