"use client"
import { motion } from "framer-motion"
import { Button } from "@/app-components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-30">
      {/* Optimized Hero Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://i.pinimg.com/1200x/e9/01/bf/e901bf2bed461c411f141c92b0344ecf.jpg"
          alt="Hero Background"
          fill
          className="object-cover object-center"
          priority // ensures image is loaded ASAP for LCP
        />
        <div className="absolute inset-0 bg-black/50" /> {/* overlay */}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.8, staggerChildren: 0.2 },
            },
          }}
        >
          {/* Heading */}
          <motion.div
            className="space-y-4"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
              Empowering <br />
              Professionals, <span className="text-white">Enabling</span> Progress
            </h1>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
            }}
          >
            <Link href="/programs">
              <Button
                size="lg"
                className="border-2 border-secondary/40 bg-secondary/70 text-white hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/25 cursor-pointer rounded-full"
              >
                EXPLORE PROGRAMS
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
