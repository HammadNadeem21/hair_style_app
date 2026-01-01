
"use client";
import localFont from "next/font/local";
import "./globals.css";
// import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { usePathname } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



import { ImageProvider } from "@/context/ImageContext";
import { AuthProvider } from "@/components/AuthProvider";
import { CreditProvider } from "@/context/CreditContext";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const path = usePathname();

  const hideNav = ["/Scan", "/sign_in", "/sign_up"].includes(path);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ImageProvider>
          <AuthProvider>
            <CreditProvider>
              {!hideNav && <Nav />}
              {children}
              <Toaster position="top-center" richColors />
              {/* <Footer/> */}
            </CreditProvider>
          </AuthProvider>
        </ImageProvider>
      </body>
    </html>
  );
}
