import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "ICCD Nepal – International Center for Capacity Development",
  description:
    "Your partner in professional development, offering expert-led training in AML, ESG, ECL, Credit Risk, Customer Service, and more to elevate institutional performance.",
  icons: {
    icon: "/Images/Logo/3.png", // favicon
  },
  openGraph: {
    title: "ICCD Nepal – International Center for Capacity Development",
    description:
      "Your partner in professional development, offering expert-led training in AML, ESG, ECL, Credit Risk, Customer Service, and more to elevate institutional performance.",
    url: "https://www.iccdnepal.com",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* JSON-LD for organization logo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "ICCD Nepal – International Center for Capacity Development",
              "url": "https://www.iccdnepal.com",
              "logo": "https://www.iccdnepal.com/Images/Logo/3.png",
            }),
          }}
        />
      </head>
      <body className={`${roboto.variable} antialiased`}>{children}</body>
    </html>
  );
}
