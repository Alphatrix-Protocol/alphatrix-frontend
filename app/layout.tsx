import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import "./globals.css";
import PrivyProviders from "@/app/providers/PrivyProvider";
import QueryProvider from "@/components/providers/query-provider";
import GlobalLoadingBar from "@/components/ui/global-loading-bar";
import AuthSync from "@/app/providers/AuthSync";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alpatrix",
  description: "Alpatrix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${barlow.variable} antialiased`}>
        <PrivyProviders>
          <QueryProvider>
            <AuthSync />
            <GlobalLoadingBar />
            {children}
          </QueryProvider>
        </PrivyProviders>
      </body>
    </html>
  );
}
