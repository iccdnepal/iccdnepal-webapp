import { Header } from "@/app-components/header"
import { Footer } from "@/app-components/footer"
import { PrismaClient } from "@prisma/client"
import { LegalDocumentList } from "@/app-components/legal-document-list"
import Script from "next/script"
import type { Metadata } from "next"

const prisma = new PrismaClient()

// --- Metadata for SEO ---
export const metadata: Metadata = {
  title: "Legal Documents – ICCD Nepal | Transparency & Compliance",
  description:
    "Access ICCD Nepal's comprehensive list of legal documents, laws enacted by Parliament, and policies issued by Nepal Rastra Bank. Ensuring transparency and accountability.",
  keywords: [
    "ICCD Nepal",
    "Legal Documents",
    "Nepal Rastra Bank",
    "Laws of Nepal",
    "Transparency",
    "Compliance",
  ],
  authors: [{ name: "ICCD Nepal", url: "https://iccdnepal.com" }],
  publisher: "ICCD Nepal",
  openGraph: {
    title: "Legal Documents – ICCD Nepal | Transparency & Compliance",
    description:
      "Access ICCD Nepal's comprehensive list of legal documents, laws enacted by Parliament, and policies issued by Nepal Rastra Bank. Ensuring transparency and accountability.",
    url: "https://iccdnepal.com/legal",
    siteName: "ICCD Nepal",
    type: "website",
    images: [
      {
        url: "/Images/Logo/3.png",
        width: 1200,
        height: 630,
        alt: "ICCD Nepal Legal Documents",
      },
    ],
  },
}

export default async function LegalListPage() {
  const docs = await prisma.legalDocument.findMany({
    orderBy: { title: "asc" },
  })

  // JSON-LD structured data for Organization + legal documents
  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ICCD Nepal",
    url: "https://iccdnepal.com",
    logo: "https://iccdnepal.com/Images/Logo/3.png",
    description:
      "ICCD Nepal is committed to transparency and capacity building. This page provides access to legal documents, laws enacted by Parliament, and policies issued by Nepal Rastra Bank.",
    hasPart: docs.map(doc => ({
      "@type": "CreativeWork",
      name: doc.title,
      url: `https://iccdnepal.com/legal/${doc.slug}`,
      datePublished: doc.createdAt?.toISOString(),
      inLanguage: "en",
    })),
  }

  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Script for SEO */}
      <Script type="application/ld+json" id="legal-org-jsonld">
        {JSON.stringify(orgStructuredData)}
      </Script>

      <Header />

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight text-white md:text-center lg:text-center text-left">
            Legal Documents
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-left lg:text-center md:text-center">
            Transparency and accountability guide our operations. Below is a compilation of legal acts along with other laws enacted by the Parliament of Nepal and policies issued by Nepal Rastra Bank.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <LegalDocumentList initialDocs={docs} />
      </div>

      <Footer />
    </main>
  )
}
