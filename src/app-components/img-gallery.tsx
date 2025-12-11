"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

type GalleryImage = {
    id: string
    imageUrl: string
}

export function ImgGallery({ images }: { images: GalleryImage[] }) {
    const [index, setIndex] = useState(0)
    const [selected, setSelected] = useState<GalleryImage | null>(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    // Auto slide every 3s
    useEffect(() => {
        if (!images || images.length < 3) return
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [images])

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!selected) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                navigatePrevious()
            } else if (e.key === "ArrowRight") {
                navigateNext()
            } else if (e.key === "Escape") {
                setSelected(null)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selected, selectedIndex, images])

    if (!images || images.length < 3) return null

    const next = () => setIndex((prev) => (prev + 1) % images.length)

    // group the 8 images into a looping gallery view
    const getSlice = (start: number) => {
        const arr = []
        for (let i = 0; i < 5; i++) arr.push(images[(start + i) % images.length])
        return arr
    }

    const group = getSlice(index)

    // Lightbox navigation functions
    const navigateNext = () => {
        const nextIndex = (selectedIndex + 1) % images.length
        setSelectedIndex(nextIndex)
        setSelected(images[nextIndex])
    }

    const navigatePrevious = () => {
        const prevIndex = (selectedIndex - 1 + images.length) % images.length
        setSelectedIndex(prevIndex)
        setSelected(images[prevIndex])
    }

    const openLightbox = (image: GalleryImage, imgIndex: number) => {
        setSelected(image)
        setSelectedIndex(imgIndex)
    }

    return (
        <section className="py-12 md:py-16 lg:py-24 bg-background overflow-hidden">

            {/* Title and Navigation */}
            <div className="flex justify-between items-center mb-8 md:mb-12 w-[90%] max-w-6xl mx-auto px-4 md:px-0">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-left lg:text-center">Our Canvas</h2>

                {/* Navigation Arrows */}
                <div className="flex gap-3">
                    <button
                        onClick={next}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center hover:bg-gradient-to-br from-secondary/80 to-secondary  transition-all duration-300 cursor-pointer"
                    >
                        <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                </div>
            </div>

            {/* Gallery */}
            <div className="relative w-[95%] md:w-[90%] max-w-6xl mx-auto">

                <AnimatePresence mode="wait">
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        key={index}
                        className="grid grid-cols-2 md:grid-cols-4 gap-2 h-[300px] sm:h-[350px] md:h-[450px]"
                    >
                        {/* Left Large */}
                        <div
                            className="relative col-span-1 row-span-2 md:row-span-1 h-full rounded-md overflow-hidden cursor-pointer"
                            onClick={() => openLightbox(group[0], (index + 0) % images.length)}
                        >
                            <Image src={group[0].imageUrl} alt="" fill className="object-cover" />
                        </div>

                        {/* Middle Top */}
                        <div
                            className="relative col-span-1 h-full rounded-md overflow-hidden cursor-pointer"
                            onClick={() => openLightbox(group[1], (index + 1) % images.length)}
                        >
                            <Image src={group[1].imageUrl} alt="" fill className="object-cover" />
                        </div>

                        {/* Middle Bottom - 2 stacked */}
                        <div className="hidden md:flex col-span-1 flex-col gap-2 h-full">
                            <div
                                className="relative flex-1 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => openLightbox(group[2], (index + 2) % images.length)}
                            >
                                <Image src={group[2].imageUrl} alt="" fill className="object-cover" />
                            </div>
                            <div
                                className="relative flex-1 rounded-md overflow-hidden cursor-pointer"
                                onClick={() => openLightbox(group[3], (index + 3) % images.length)}
                            >
                                <Image src={group[3].imageUrl} alt="" fill className="object-cover" />
                            </div>
                        </div>

                        {/* Right Large */}
                        <div
                            className="relative col-span-1 h-full rounded-md overflow-hidden cursor-pointer"
                            onClick={() => openLightbox(group[4], (index + 4) % images.length)}
                        >
                            <Image src={group[4].imageUrl} alt="" fill className="object-cover" />
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-6 md:mt-8">
                    {images.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`h-2 rounded-full transition-all cursor-pointer
                            ${i === index ? "w-8 bg-secondary" : "w-2 bg-secondary/20"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lightbox View */}
            {selected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelected(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="relative w-full h-full max-w-[90vw] max-h-[90vh] md:w-[85vw] md:h-[85vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image src={selected.imageUrl} alt="" fill className="object-contain" />

                        {/* Close Button */}
                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-2 right-2 md:top-6 md:right-6 text-white hover:text-red-400 transition-colors"
                        >
                            <X className="w-8 h-8 md:w-10 md:h-10" />
                        </button>

                        {/* Previous Button */}
                        <button
                            onClick={navigatePrevious}
                            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                        >
                            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={navigateNext}
                            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                        >
                            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs md:text-sm">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                </motion.div>
            )}

        </section>
    )
}