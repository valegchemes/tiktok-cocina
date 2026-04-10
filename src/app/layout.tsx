import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/layout/BottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TikTok Cocina PWA",
  description: "Descubre y comparte las mejores recetas en video corto.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white h-screen w-full overflow-hidden`}
      >
        <main className="relative h-full w-full max-w-md mx-auto sm:border-x sm:border-zinc-800 bg-black flex flex-col hide-scrollbar">
          {children}
        </main>
        {/* We place Bottom Navigation inside the max-w-md constraint */}
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center">
          <div className="w-full max-w-md pointer-events-auto">
            <BottomNavigation />
          </div>
        </div>
      </body>
    </html>
  );
}
