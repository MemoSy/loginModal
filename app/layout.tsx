import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const inter = Cairo({ subsets: ['arabic'] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" className="w-full h-full">
        <body dir="rtl" className={`w-full h-full ${inter.className}`}>
          {children}
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
