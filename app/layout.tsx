import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import clsx from "clsx";
import GlobalBackButton from "@/components/GlobalBackButton";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/CyberBackground";
import GlobalAiAssistant from "@/components/GlobalAiAssistant";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CypherDocs",
  description: "Collaborative knowledge hub for security professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          inter.variable,
          jetbrainsMono.variable,
          "min-h-screen bg-background text-text font-sans antialiased"
        )}
      >
        <Providers>
          <CyberBackground />
          <div className="relative z-10">
            <GlobalAiAssistant />
            <Navbar />
            {children}
            <GlobalBackButton />
          </div>
          <Toaster position="bottom-right" theme="system" />
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
