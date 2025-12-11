import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
   title: "ICCD Nepal – International Center for Capacity Development",
  description:
    "ICCD Nepal offers international training, capacity development programs, professional certifications, career counseling, and global development opportunities.",
  icons: {
    icon: "/Images/Logo/3.png",
  },
  openGraph: {
    title: "ICCD Nepal – International Center for Capacity Development",
    description:
      "Advance your career with ICCD Nepal through international training, capacity development, certifications, and professional development programs.",
    url: "https://www.iccdnepal.com",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}