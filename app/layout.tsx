import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/ui/theme/ThemeProvider";
import { Navbar } from "@/ui/nav/Navbar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Syllogimous",
  description: "Relational reasoning training"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="stylesheet" href="/css/codec.css" />
        <link rel="stylesheet" href="/fonts/cool/coolicons.css" />
        <link rel="stylesheet" href="/css/styles.css" />
        <style id="live-styles" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main className="pt-16 sm:pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}


