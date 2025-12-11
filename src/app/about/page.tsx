import { Header } from "@/app-components/header";
import { AboutHero } from "@/app-components/about-hero";
import { MissionVision } from "@/app-components/mission-vision";
import { CTAStrip } from "@/app-components/cta-strip";
import { Footer } from "@/app-components/footer";
import WhyICCD_Toggle from "@/app-components/why-iccd";
import CompanyInfo from "@/app-components/company-info";
import { ImgGallery } from "@/app-components/img-gallery";
import { getGalleryImages } from "@/actions/gallery-actions";
import MoreAboutUs from "@/app-components/more-about-us";
import Script from "next/script";
import type { Metadata } from "next";

// --- Metadata for SEO ---
export const metadata: Metadata = {
  title: "About ICCD Nepal | Capacity Development & Professional Excellence",
  description:
    "Learn about ICCD Nepal, our mission, vision, values, and how we empower professionals with top-tier programs in ESG, Risk & Compliance, Service Excellence, and more.",
  keywords: [
    "ICCD Nepal",
    "About ICCD",
    "Mission",
    "Vision",
    "Capacity Development",
    "Professional Training",
    "Corporate Programs",
  ],
  authors: [{ name: "ICCD Nepal", url: "https://iccdnepal.com" }],
  publisher: "ICCD Nepal",
  openGraph: {
    title: "About ICCD Nepal | Capacity Development & Professional Excellence",
    description:
      "Discover ICCD Nepal's mission, vision, values, and how we provide professional development programs to empower individuals and organizations.",
    url: "https://iccdnepal.com/about",
    siteName: "ICCD Nepal",
    type: "website",
    images: [
      {
        url: "/Images/Logo/3.png",
        width: 1200,
        height: 630,
        alt: "About ICCD Nepal",
      },
    ],
  },
  
};

export default async function AboutPage() {
  const { data: images } = await getGalleryImages();

  // JSON-LD structured data for Organization
  const orgStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ICCD Nepal",
    url: "https://iccdnepal.com",
    logo: "https://iccdnepal.com/Images/Logo/3.png",
    description:
      "ICCD Nepal is a leading professional development organization focused on capacity building, ESG, Risk & Compliance, and Service Excellence programs.",
  };

  return (
    <main className="min-h-screen">
      {/* JSON-LD Script for SEO */}
      <Script type="application/ld+json" id="org-jsonld">
        {JSON.stringify(orgStructuredData)}
      </Script>

      <Header />
      <AboutHero />
      <MoreAboutUs />
      {/* <AboutStory /> */}
      <MissionVision />
      {/* <CompanyInfo /> */}
      <WhyICCD_Toggle />
      <ImgGallery images={images || []} />
      {/* <LeadershipTeam /> */}
      {/* <ImpactNumbers/> */}
      {/* <Testimonials /> */}
      {/* <IndustryTestimonials /> */}
      {/* <Accreditation /> */}
      <CTAStrip />
      <Footer />
    </main>
  );
}
