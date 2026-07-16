import type { Metadata } from "next";
import "./globals.css";
import { AppStateProvider } from "@/context/app-state";

export const metadata: Metadata = {
  title: "MSSN Ikeja Area Council HTC Portal",
  description: "Holiday Training Course (HTC) Portal - Spiritual, Academic and Personal Growth for Muslims.",
  icons: {
    icon: "/mss-ikeja-logo.png",
    shortcut: "/mss-ikeja-logo.png",
    apple: "/mss-ikeja-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-on-surface font-sans">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
