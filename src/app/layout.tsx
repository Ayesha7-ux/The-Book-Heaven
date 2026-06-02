import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--sans-font",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--serif-font",
});

export const metadata: Metadata = {
  title: "The Book Heaven | Premium eLibrary",
  description: "Advanced online eLibrary platform for reading, uploading, and managing digital books.",
};

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main>{children}</main>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
