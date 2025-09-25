import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import AuthInitializer from "@/context/AuthInitializer";
import { AppUtilsProvider } from "@/context/AppUtils";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* temporary pa ni sha, since kapoy ilis tagsa tagsaon nako kada page hmmp TTOTT */}
        <AppUtilsProvider> 
          <Toaster />
          <AuthInitializer>
            {children}
          </AuthInitializer>
          <Footer />
        </AppUtilsProvider>
      </body>
    </html>
  );
}
