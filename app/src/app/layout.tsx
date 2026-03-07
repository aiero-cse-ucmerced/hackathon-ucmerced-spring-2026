import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Footer } from "@/components/Footer";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      <body className={`${poppins.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <AuthProvider>
          <main className="flex min-h-0 flex-1 flex-col">{children}</main>
          <ServiceWorkerRegistrar />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
