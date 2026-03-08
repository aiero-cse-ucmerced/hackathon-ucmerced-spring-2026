import type { Metadata } from "next";
import { Poppins, Syne, DM_Sans } from "next/font/google";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "UncookedAura – Cook better than everyone",
  description:
    "A job market search that perfectly matches your profile regardless your prior experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${syne.variable} ${dmSans.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <AuthProvider>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <ServiceWorkerRegistrar />
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
