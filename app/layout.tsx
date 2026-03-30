import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Happy Birthday Pascy 🎀",
  description: "A gift from Cynthia & Ezinwanne",
  openGraph: {
    title: "Happy Birthday Pascy 🎀",
    description: "A gift from Cynthia & Ezinwanne",
    url: "https://pascy-birthday.vercel.app",
    siteName: "Pascy's Birthday Gift",
    images: [
      {
        url: "https://pascy-birthday.vercel.app/photos/birthday.jpg",
        width: 1200,
        height: 630,
        alt: "Birthday gift for Pascy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Birthday Pascy 🎀",
    description: "A gift from Cynthia & Ezinwanne",
    images: ["https://pascy-birthday.vercel.app/photos/birthday.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}