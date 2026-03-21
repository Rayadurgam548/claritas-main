import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SplashProvider } from "@/components/providers/SplashProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Claritas | AI Legal Document Analyzer",
  description: "Simplifying complex legal documents using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} font-sans antialiased min-h-screen bg-background text-foreground transition-colors duration-300`}
      >
        <SplashProvider>
          {children}
        </SplashProvider>
      </body>
    </html>
  );
}
