"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Award, Users, Lightbulb, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const values = [
    {
        icon: ShieldCheck,
        title: "Integrity",
        description: "Ethical and transparent conduct in all our programs and partnerships."
    },
    {
        icon: Award,
        title: "Excellence",
        description: "Consistently delivering high-quality, impactful learning experiences."
    },
    {
        icon: Users,
        title: "Collaboration",
        description: "Working closely with industry experts, local and international institutions, and learners."
    },
    {
        icon: Lightbulb,
        title: "Innovation",
        description: "Adopting new tools, technologies, and training methodologies."
    },
    {
        icon: Heart,
        title: "Inclusion",
        description: "Making professional development accessible to individuals at all levels of the financial industry."
    }
]

const MoreAboutUs = () => {
    const [currentIndex, setCurrentIndex] = useState(0)

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === values.length - 1 ? 0 : prev + 1))
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? values.length - 1 : prev - 1))
    }

    return (
        <section className="w-full md:w-[85%] lg:w-[80%] mx-auto py-12 md:py-16 lg:py-20 bg-background text-foreground overflow-hidden">
            <div className="px-4">
                <div className="grid lg:grid-cols-1 gap-10 md:gap-12 lg:gap-16 items-start">

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 md:space-y-6"
                    >
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-left md:text-center">
                            Beyond Training
                        </h2>

                        <p className="text-base md:text-lg text-left md:text-center text-muted-foreground leading-relaxed max-w-5xl mx-auto">
                            In a financial landscape shaped by rapid technological change, global competition,
                            and evolving regulations, we equip professionals with practical skills and knowledge.
                        </p>
                    </motion.div>

                    {/* Values Cards */}
                    <div className="space-y-3 md:space-y-4">

                        {/* Mobile: Swipeable carousel with single card */}
                       {/* Mobile Carousel */}
                        <div className="sm:hidden w-full">
                        <div className="relative max-w-sm mx-auto">

                            {/* Viewport */}
                            <div
                            className="overflow-hidden w-full"
                            onTouchStart={(e) => {
                                e.currentTarget.dataset.startX = String(e.touches[0].clientX)
                            }}
                            onTouchEnd={(e) => {
                                const startX = parseFloat(e.currentTarget.dataset.startX || "0")
                                const endX = e.changedTouches[0].clientX
                                const diff = startX - endX
                                if (Math.abs(diff) > 50) diff > 0 ? handleNext() : handlePrev()
                            }}
                            >

                            {/* Track */}
                            <div
                                className="flex transition-transform duration-300 ease-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {values.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex-none w-full"
                                >
                                    {/* CARD */}
                                    <div className="w-[90%] mx-auto relative p-6 rounded-2xl bg-gradient-to-br 
                                        from-gray-900/95 to-gray-800/95 border border-gray-700/50 
                                        backdrop-blur-sm shadow-xl overflow-hidden">

                                    <div className="absolute inset-0 bg-gradient-to-br 
                                        from-primary/5 via-transparent to-primary/10" />

                                    <div className="relative z-10 text-center space-y-4">
                                        <div className="flex justify-center">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br 
                                            from-primary to-primary/80 flex items-center justify-center 
                                            shadow-lg shadow-primary/20">
                                            <item.icon className="w-7 h-7 text-white" />
                                        </div>
                                        </div>

                                        <h4 className="text-xl font-bold text-white">
                                        {item.title}
                                        </h4>

                                        <p className="text-gray-300 text-sm leading-relaxed">
                                        {item.description}
                                        </p>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 h-1 
                                        bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
                                    </div>
                                </div>
                                ))}
                            </div>
                            </div>

                            {/* Arrows BELOW CARD */}
                            <div className="flex items-center justify-center gap-3 mt-6">
                            <button onClick={handlePrev}
                                className="bg-gray-800/80 hover:bg-gray-700/80 p-2.5 rounded-full 
                                    border border-gray-700/50">
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>

                            <div className="flex gap-2">
                                {values.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 
                                            ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-gray-600"}`}
                                />
                                ))}
                            </div>

                            <button onClick={handleNext}
                                className="bg-gray-800/80 hover:bg-gray-700/80 p-2.5 rounded-full 
                                    border border-gray-700/50">
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                            </div>

                        </div>
                        </div>
                        {/* Tablet: 2 columns */}
                        <div className="hidden sm:grid md:hidden grid-cols-2 gap-3">
                            {values.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 
                                    border border-gray-700/50 hover:border-primary/50 
                                    transition-all duration-500 group overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 text-center">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 
                                            flex items-center justify-center shadow-lg shadow-primary/30 
                                            group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                <item.icon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300">
                                            {item.title}
                                        </h4>

                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 
                                    group-hover:w-full transition-all duration-500" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Desktop: Original layout (2 + 3) */}
                        <div className="hidden md:block">
                            {/* First Row (2 cards) */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {values.slice(0, 2).map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 
                                        border border-gray-700/50 hover:border-primary/50 
                                        transition-all duration-500 group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 text-center">
                                            <div className="flex justify-center mb-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 
                                                flex items-center justify-center shadow-lg shadow-primary/30 
                                                group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    <item.icon className="w-7 h-7 text-white" />
                                                </div>
                                            </div>

                                            <h4 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                                                {item.title}
                                            </h4>

                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 
                                        group-hover:w-full transition-all duration-500" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Second Row (3 cards) */}
                            <div className="grid grid-cols-3 gap-3">
                                {values.slice(2).map((item, index) => (
                                    <motion.div
                                        key={item.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: (index + 2) * 0.1 }}
                                        className="relative p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 
                                        border border-gray-700/50 hover:border-primary/50 
                                        transition-all duration-500 group overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 text-center">
                                            <div className="flex justify-center mb-4">
                                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 
                                                flex items-center justify-center shadow-lg shadow-primary/30 
                                                group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                    <item.icon className="w-7 h-7 text-white" />
                                                </div>
                                            </div>

                                            <h4 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300">
                                                {item.title}
                                            </h4>

                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-primary/50 
                                        group-hover:w-full transition-all duration-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}

export default MoreAboutUs