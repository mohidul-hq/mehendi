import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/SessionProvider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Taslima Mehendi Artist — Beautiful Mehndi Designs",
    template: "%s | Taslima Mehendi Artist",
  },
  description:
    "Professional mehndi artist specializing in Bridal, Arabic, Party, and Kids mehndi designs. Book your appointment today!",
  keywords: [
    "mehndi artist",
    "henna artist",
    "bridal mehndi",
    "arabic mehndi",
    "mehndi booking",
    "professional mehndi",
  ],
  openGraph: {
    type: "website",
    siteName: "Taslima Mehendi Artist",
    title: "Taslima Mehendi Artist — Beautiful Mehndi Designs",
    description:
      "Professional mehndi artist specializing in Bridal, Arabic, Party, and Kids mehndi designs.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <SessionProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a0d11",
                color: "#FAF7F2",
                borderRadius: "12px",
                border: "1px solid #C9A84C",
                fontFamily: "Inter, system-ui, sans-serif",
              },
              success: {
                iconTheme: {
                  primary: "#C9A84C",
                  secondary: "#1a0d11",
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
