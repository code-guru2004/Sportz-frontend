import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sportz - Your Ultimate Sports Management App",
  description: "Sportz is a comprehensive sports management application designed to streamline the organization and scheduling of sports events. Whether you're an athlete, coach, or administrator, Sportz provides an intuitive platform to manage schedules, track performance, and connect with the sports community. With features like real-time updates, personalized dashboards, and seamless communication tools, Sportz is your go-to solution for all your sports management needs.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <Providers>
    {children}
    <Toaster position="top-right" richColors />
  </Providers>
</body>
    </html>
  );
}
