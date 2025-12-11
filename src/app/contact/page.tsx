import { Header } from "@/app-components/header"
import { ContactHero } from "@/app-components/contact-hero"
import { ContactForm } from "@/app-components/contact-form"
import { Footer } from "@/app-components/footer"
import { Testimonials } from "@/app-components/testimonials"
import { PrismaClient } from "@prisma/client"
import Script from "next/script"
import type { Metadata } from "next"

const prisma = new PrismaClient()

// --- Metadata for SEO ---
export const metadata: Metadata = {
  title: "Contact ICCD Nepal | Professional Development & Capacity Building",
  description:
    "Reach out to ICCD Nepal for inquiries, partnerships, or support. Connect with our team for guidance on programs, services, and professional development initiatives.",
  keywords: [
    "ICCD Nepal",
    "Contact ICCD",
    "Professional Development",
    "Capacity Building",
    "Partnerships",
    "Support",
  ],
  authors: [{ name: "ICCD Nepal", url: "https://iccdnepal.com" }],
  publisher: "ICCD Nepal",
  openGraph: {
    title: "Contact ICCD Nepal | Professional Development & Capacity Building",
    description:
      "Reach out to ICCD Nepal for inquiries, partnerships, or support. Connect with our team for guidance on programs, services, and professional development initiatives.",
    url: "https://iccdnepal.com/contact",
    siteName: "ICCD Nepal",
    type: "website",
    images: [
      {
        url: "/Images/Logo/3.png",
        width: 1200,
        height: 630,
        alt: "Contact ICCD Nepal",
      },
    ],
  },
}

export default async function ContactPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  // JSON-LD structured data for Organization + ContactPage
  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ICCD Nepal",
    url: "https://iccdnepal.com",
    logo: "https://iccdnepal.com/Images/Logo/3.png",
    description:
      "ICCD Nepal provides professional development programs, capacity building, and support services. Contact us for inquiries, partnerships, or guidance on our offerings.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "iccdnepal@gmail.com",
      telephone: "+977 9700013707",
      areaServed: "NP",
      availableLanguage: ["English", "Nepali"],
    },
  }

  return (
    <main className="min-h-screen">
      {/* JSON-LD Script for SEO */}
      <Script type="application/ld+json" id="contact-org-jsonld">
        {JSON.stringify(orgStructuredData)}
      </Script>

      <Header />
      <ContactHero />
      <ContactForm />
      {/* <Testimonials testimonials={testimonials} /> */}
      {/* <ContactMap /> */}
      <Footer />
    </main>
  )
}
