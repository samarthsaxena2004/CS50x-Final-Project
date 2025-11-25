import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Analytics } from "@vercel/analytics/react"; // <--- Added Import

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samarth Saxena | Portfolio",
  description: "Full Stack Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
          <Analytics /> {/* <--- Added Tracker */}
        </ThemeProvider>
      </body>
    </html>
  );
}