
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const path = usePathname();

  const hideNav = path === "/Scan" || path === "/result";

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <ImageProvider>
          {!hideNav && <Nav />}
          {children}
          {/* <Footer/> */}
        </ImageProvider>
      </body>
    </html>
  );
}
