"use client"

import { useState, type SVGProps } from "react"
import { Shield, Lightbulb, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

type ValueItem = {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
}

const defaultItems: ValueItem[] = [
  { icon: Shield,     title: "Empowering workforce", description: "Developing people who deliver results." },
  { icon: Lightbulb,  title: "Innovative training",  description: "Learning that makes an impact." },
  { icon: TrendingUp, title: "Driving change",       description: "Transforming knowledge into action that shapes lasting growth." },
]

export function CoreValues({ items = defaultItems }: { items?: ValueItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="py-24 bg-background">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">

    <motion.div
      className="grid md:grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, staggerChildren: 0.3 },
        },
      }}
    >
      {/* LEFT heading — unchanged on desktop */}
      <motion.div
        variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } }}
        className="text-center md:text-center lg:text-left"
      >
        <h2 className="
          text-3xl 
          sm:text-4xl 
          md:text-4xl 
          lg:text-4xl 
          font-extrabold 
          text-white 
          leading-tight
        ">
          Building <span className="text-primary">long-term capacity</span> that{" "}
          <span className="text-primary">strengthens</span> organizations.
        </h2>
      </motion.div>

      {/* RIGHT side values */}
      <motion.div className="space-y-6 md:space-y-8 lg:space-y-6">
        {items.map((item, i) => {
          const Icon = item.icon
          const dim = hovered !== null && hovered !== i

          return (
            <motion.div
              key={i}
              role="button"
              tabIndex={0}
              aria-pressed={hovered === i}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onBlur={() => setHovered(null)}
              variants={{
                hidden: { opacity: 0, x: 40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
              }}
              whileHover={{ scale: 1.03 }}
              className={`group flex items-start gap-4 sm:gap-6 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-secondary/5 ${
                dim ? "opacity-60" : "opacity-100"
              }`}
            >
              {/* ICON — shrink slightly on mobile/tablet */}
              <motion.div
                className="flex-shrink-0 
                  w-12 h-12 
                  sm:w-14 sm:h-14 
                  lg:w-14 lg:h-14 
                  rounded-full bg-secondary/10 flex items-center justify-center"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, repeatType: "loop", duration: 3, ease: "easeInOut" }}
                whileHover={{ scale: 1.1 }}
              >
                <div
                  className="
                    w-12 h-12 
                    sm:w-14 sm:h-14 
                    lg:w-14 lg:h-14 
                    rounded-full bg-gradient-to-br from-secondary to-secondary/80 
                    flex items-center justify-center shadow-lg shadow-secondary/30 
                    group-hover:scale-110 group-hover:rotate-3 
                    transition-all duration-300
                  "
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </motion.div>

              {/* TEXT — mobile/tablet spacing */}
              <div>
                <h3 className="text-xl sm:text-2xl lg:text-2xl font-semibold text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  </div>
</section>

  )
}
