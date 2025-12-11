"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/app-components/ui/card"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  id: string
  quote: string
  rating: number
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile/tablet view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  const getCardStyle = (index: number) => {
    let diff = index - currentIndex
    if (diff > testimonials.length / 2) diff -= testimonials.length
    else if (diff < -testimonials.length / 2) diff += testimonials.length

    // Mobile/Tablet: Only show current card
    if (isMobile) {
      if (diff === 0) {
        return "scale-100 opacity-100 z-20 translate-x-0"
      } else {
        return "scale-90 opacity-0 z-0"
      }
    }

    // Desktop: Show side cards
    if (diff === 0) {
      return "scale-105 opacity-100 z-20 translate-x-0 cursor-pointer"
    } else if (diff === 1 || diff === -(testimonials.length - 1)) {
      return "scale-85 opacity-50 z-10 translate-x-[70%]"
    } else if (diff === -1 || diff === testimonials.length - 1) {
      return "scale-85 opacity-50 z-10 -translate-x-[70%]"
    } else {
      return "scale-75 opacity-0 z-0"
    }
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(0,0,0,0.95))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl leading-tight text-white">
            Participant Reviews
          </h2>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-center gap-4 md:gap-6">
            
            {/* Left Arrow - visible on mobile/tablet */}
            {isMobile && (
              <button
                onClick={handlePrev}
                className="flex-shrink-0 bg-secondary/20 hover:bg-secondary/40 p-2 md:p-3 rounded-full transition-colors z-30"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            )}

            <div 
              className="relative w-full max-w-2xl min-h-[280px] sm:h-72 md:h-80 flex items-center justify-center"
              onClick={isMobile ? undefined : handleNext}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`absolute transition-all duration-500 ease-out w-full px-1 sm:px-4 md:px-0 ${getCardStyle(index)}`}
                >
                  <Card className="bg-background border-2 rounded-3xl md:rounded-2xl border-secondary/20 
                                  bg-gradient-to-br from-gray-900 to-gray-800 
                                  border border-gray-700/50 transition-all duration-500 shadow-xl">
                    <CardContent className="p-6 sm:p-6 md:p-8">
                      <div className="flex items-center mb-4 md:mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 md:h-5 md:w-5 text-secondary fill-current" />
                        ))}
                      </div>
                      <div className="relative mb-4 md:mb-6">
                        <Quote className="h-7 w-7 md:h-8 md:w-8 text-primary/20 absolute -top-1 -left-1 md:-top-2 md:-left-2" />
                        <p className="text-base sm:text-base text-muted-foreground leading-relaxed italic pl-6 md:pl-6">
                          &quot;{testimonial.quote}&quot;
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Right Arrow - visible on mobile/tablet */}
            {isMobile && (
              <button
                onClick={handleNext}
                className="flex-shrink-0 bg-secondary/20 hover:bg-secondary/40 p-2 md:p-3 rounded-full transition-colors z-30"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            )}

          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-secondary" : "w-2 bg-secondary/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}