import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Homelab LLM Benchmark",
  description: "Local LLM benchmark results on GTX 1650 Ti + k0s cluster",
};

const navItems = [
  { href: "/", label: "Benchmark" },
  { href: "/network", label: "Network" },
  { href: "/spec", label: "Spec" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950`}>
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 flex items-center h-14 gap-6">
            <span className="font-bold text-gray-100 text-sm">homelab-bench</span>
            <div className="flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-gray-100 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="ml-auto">
              <a
                href="https://github.com/AobaIwaki123/homelab-bench"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                GitHub →
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
