import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

const greatVibes = localFont({
  src: "../fonts/greatvibes/GreatVibes-Regular.ttf",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "The Cove - Apartment and lodging",
  description: "As unique as your imagination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${greatVibes.variable} font-sans antialiased`}>
        <Header />
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
