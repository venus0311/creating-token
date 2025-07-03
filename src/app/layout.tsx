import type { Metadata } from "next";
import "./globals.css";
import { WalletConnectProvider } from "@/providers/WalletConnectProvider";
import { ToastProvider } from "@/components/ui/toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "TokenFi",
  description: "Token Launch Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Token" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="flex flex-col min-h-screen">
        <WalletConnectProvider>
          <ToastProvider>
            <Header />
            <main className="flex-grow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {children}
              </div>
            </main>
            <Footer />
          </ToastProvider>
        </WalletConnectProvider>
      </body>
    </html>
  );
}
