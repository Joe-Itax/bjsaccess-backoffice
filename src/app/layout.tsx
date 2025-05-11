import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationManager } from "@/components/notification-manager";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { TokenRefresher } from "@/components/token-refresher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BJS Access",
  description: "Back office de gestion du blog de BJS Access",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReactQueryProvider>
          <NotificationManager />
          <TokenRefresher />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
