import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://arksim.io"),
  title: "ArkSim — Light, rapid process simulation for business teams",
  description:
    "ArkSim is a light, low-cost desktop process simulator for analysts and architects. Model automation, agents, controls and quality changes for everyday business processes, and see the cost and time impact before you commit. A 30-minute learning curve.",
  keywords: [
    "process simulation",
    "discrete event simulation",
    "business process modelling",
    "lightweight process simulation",
    "affordable simulation software",
    "automation impact",
    "process economics",
  ],
  openGraph: {
    title: "ArkSim — Light, rapid process simulation for business teams",
    description:
      "Model process change — automation, agents, controls, quality — and see the cost and time impact in minutes. Currently in beta.",
    type: "website",
    siteName: "ArkSim",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArkSim — Process simulation made simple",
    description:
      "Model process change and see the cost and time impact in minutes. Currently in beta.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
