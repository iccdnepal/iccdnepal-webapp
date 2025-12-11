import { CTAStrip } from "@/app-components/cta-strip"
import ECLCalculator from "@/app-components/ECLCalculator"
import { Footer } from "@/app-components/footer"
import { Header } from "@/app-components/header"
import HeroTrainMyTeam from "@/app-components/herotrainmyteam"
import { ImpactHero } from "@/app-components/impact-hero"
import { ImpactInfographic } from "@/app-components/impact-infographic"
import { ImpactMetrics } from "@/app-components/impact-metrics"
import { ImpactNumbers } from "@/app-components/impact-numbers"
import { IndustryTestimonials } from "@/app-components/industry-testimonials"
import { Testimonials } from "@/app-components/testimonials"
import { PrismaClient } from "@prisma/client"
import Script from "next/script"
import type { Metadata } from "next"

const prisma = new PrismaClient()

// --- Metadata for SEO ---
export const metadata: Metadata = {
  title: "Impact of ICCD Nepal | Driving Transformative Change",
  description:
    "Discover ICCD Nepal’s impact through programs, testimonials, and initiatives that empower individuals and organizations.",
  keywords: [
    "ICCD Nepal",
    "Impact",
    "Capacity Building",
    "Testimonials",
    "Professional Training",
    "ESG",
    "Service Excellence",
    "Risk Management",
  ],
  authors: [{ name: "ICCD Nepal", url: "https://iccdnepal.com" }],
  publisher: "ICCD Nepal",
  openGraph: {
    title: "Impact of ICCD Nepal | Driving Transformative Change",
    description:
      "Discover ICCD Nepal’s impact through programs, testimonials, and initiatives that empower individuals and organizations.",
    url: "https://iccdnepal.com/impact",
    siteName: "ICCD Nepal",
    type: "website",
    images: [
      {
        url: "https://iccdnepal.com/Image/Logo/3.png",
        width: 1200,
        height: 630,
        alt: "ICCD Impact Overview",
      },
    ],
    locale: "en_US",
  },
}

export default async function ImpactPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  // JSON-LD structured data for organization and programs
  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ICCD Nepal",
    url: "https://iccdnepal.com",
    logo: "https://iccdnepal.com/Image/Logo/3.png",
    sameAs: ["https://www.linkedin.com/company/iccd-nepal"],
    description:
      "ICCD Nepal is a center for capacity development delivering programs that empower workforce and organizations.",
    department: [
      {
        "@type": "EducationalOrganization",
        name: "ICCD Training Programs",
        description:
          "Programs designed to enhance skills in ESG, Risk, Service Excellence and more.",
      },
    ],
  }

  return (
    <main className="min-h-screen">
      {/* JSON-LD Script for SEO */}
      <Script type="application/ld+json" id="impact-org-jsonld">
        {JSON.stringify(orgStructuredData)}
      </Script>

      <Header />
      <ImpactHero />
      <ImpactMetrics />
      {/* <ECLCalculator /> */}
      {/* <ImpactNumbers /> */}
      {/* <IndustryTestimonials /> */}
      {/* <HeroTrainMyTeam /> */}
      <Testimonials testimonials={testimonials} />
      <CTAStrip />
      <Footer />
    </main>
  )
}
