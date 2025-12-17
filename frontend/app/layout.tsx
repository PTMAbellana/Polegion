import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import AppProvider from "@/context/AppProvider";
import GlobalLandscapePrompt from "@/components/GlobalLandscapePrompt";

export const metadata: Metadata = {
  title: "Polegion",
  description: "Your geometry visualizer!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#2C514C" />
        <link rel="manifest" href="/manifest.json" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/webp" href="/images/polegionIcon.webp" />
        <link rel="apple-touch-icon" href="/images/polegionIcon.webp" />
      </head>
      <body>
        <GlobalLandscapePrompt />
        <Toaster />
        <AppProvider>
          {children}
        </AppProvider>
        {/* <Footer /> */}
      </body>
    </html>
  );
}
