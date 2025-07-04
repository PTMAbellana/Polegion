import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppUtilsProvider } from "@/context/AppUtils"; 
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export const metadata: Metadata = {
  title: "Polegion",
  description: "Your geometry visualizer!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Place your meta tags here */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <AppUtilsProvider>
          <Navbar/>
          <Toaster/>
          {children}
        </AppUtilsProvider>
        <Footer />
      </body>
    </html>
  );
}