import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from "@/provider/provider";
import { Toaster } from "react-hot-toast";
import DynamicLayoutWrapper from "@/Components/Layout/DynamicLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["100", "200", "300", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Inbox Agent",
  description: "Inbox Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lexend.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Toaster position="top-center" />
          <DynamicLayoutWrapper>{children}</DynamicLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
