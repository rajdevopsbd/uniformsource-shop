import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UniformSource | Premium B2B Uniform Marketplace",
  description: "Factory-direct uniforms for schools, companies, and teams. Industrial-grade procurement with transparent pricing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased selection:bg-primary/30 min-h-screen flex flex-col`}
      >
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
}


