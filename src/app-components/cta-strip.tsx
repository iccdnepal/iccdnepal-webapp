"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const scaleUp = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }

export function CTAStrip() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      
      <div className="max-w-[95%] md:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-left md:text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3 } } }}
        >
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6 leading-tight text-balance text-white"
            variants={fadeInUp}
          >
            Build Your Brand <br /> Customize Training Solutions
          </motion.h2>

          <motion.p
            className="text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-3xl md:mx-auto text-foreground/70"
            variants={fadeInUp}
          >
            Partner with ICCD to develop tailored training programs that align with your
            institution&apos;s specific needs and regulatory requirements.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 md:gap-6 sm:justify-center"
            variants={scaleUp}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/contact">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto bg-secondary/20 border border-secondary/40 text-base md:text-lg font-semibold px-6 md:px-8 py-5 md:py-6 text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer rounded-full"
                aria-label="Schedule a consultation with ICCD"
                
              >
                SCHEDULE CONSULTATION
                <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}