import { Geist, Geist_Mono } from "next/font/google";
import ReduxProvider from '@/providers/ReduxProviders';
import InitAuth from '@/components/initAuth';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "RoomApp",
  description: "Meeting Room Booking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <InitAuth />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
