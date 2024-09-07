
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });
import { SessionProvider } from "next-auth/react";
export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>{children}</SessionProvider>
        
        
      </body>
    </html>
  );
}
