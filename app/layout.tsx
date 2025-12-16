import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecipeShare - Share your go-to recipes",
  description: "A community-driven recipe hub where home cooks and creators can publish dishes, discover new favorites, and save go-to meals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white text-zinc-900">
          <Header />

          <main className="mx-auto flex min-h-[calc(100vh-3.25rem)] max-w-6xl flex-col px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
