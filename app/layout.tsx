import type { Metadata } from "next";
// import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppUtilsProvider } from "@/context/AppUtils"; 
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";
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
      <body>
        <AppUtilsProvider>
          <Toaster/>
          {children}
        </AppUtilsProvider>
        <Footer /> 
      </body>
    </html>
  );
}
