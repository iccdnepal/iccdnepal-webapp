'use client'

import { useEffect, useRef, useState } from 'react'
import { ProgramCard } from '@/app-components/program-card'
import type { Program } from '../lib/programs'
import { Button } from '@/app-components/ui/button'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

export default function FeaturedProgram({ programs }: { programs: Program[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [cardPx, setCardPx] = useState(0)
  const [pagePx, setPagePx] = useState(0)
  const [pageIndex, setPageIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)

  // Determine visible cards based on screen width
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth
      if (width < 768) {
        setVisibleCards(1) // Mobile: 1 card
      } else if (width < 1024) {
        setVisibleCards(2) // Tablet: 2 cards
      } else {
        setVisibleCards(3) // Desktop: 3 cards
      }
    }

    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [])

  // Measure container and compute widths
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      if (!track) return

      const style = window.getComputedStyle(track)
      const gapStr = style.gap || style.columnGap || '0px'
      const gap = parseFloat(gapStr) || 0

      const container = containerRef.current ?? track
      const containerWidth = container.clientWidth

      const totalGaps = gap * (visibleCards - 1)
      const single = Math.floor((containerWidth - totalGaps) / visibleCards)
      const page = single * visibleCards + totalGaps

      setCardPx(single)
      setPagePx(page)

      if (track) {
        const currentLeft = track.scrollLeft
        const nearestPage = Math.round(currentLeft / page)
        track.scrollTo({ left: nearestPage * page, behavior: 'auto' })
        setPageIndex(Math.max(0, Math.min(nearestPage, Math.ceil(programs.length / visibleCards) - 1)))
      }
    }

    measure()

    let ro: ResizeObserver | undefined
    try {
      ro = new ResizeObserver(measure)
      if (containerRef.current) ro.observe(containerRef.current)
      if (trackRef.current) ro.observe(trackRef.current)
    } catch (e) {
      window.addEventListener('resize', measure)
    }

    return () => {
      if (ro) {
        if (containerRef.current) ro.unobserve(containerRef.current)
        if (trackRef.current) ro.unobserve(trackRef.current)
      } else {
        window.removeEventListener('resize', measure)
      }
    }
  }, [programs.length, visibleCards])

  const pagesCount = Math.max(1, Math.ceil(programs.length / visibleCards))

  const goToPage = (p: number) => {
    const track = trackRef.current
    if (!track) return
    const newPage = (p + pagesCount) % pagesCount
    setPageIndex(newPage)
    track.scrollTo({ left: newPage * pagePx, behavior: 'smooth' })
  }

  const next = () => {
    goToPage(pageIndex + 1)
  }

  const prev = () => {
    goToPage(pageIndex - 1)
  }

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background">
      <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight text-white">
            Our <span className="text-white">Featured Programs</span>
          </h2>

          <Button
            asChild
            size="lg"
            className="rounded-full bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 md:px-8 text-sm md:text-base"
          >
            <Link href="/programs">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Slider viewport */}
        <div
          ref={containerRef}
          className="py-6 md:py-8 lg:py-10 overflow-hidden"
          style={{ width: '100%' }}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="flex items-stretch gap-4 md:gap-6 overflow-x-auto scroll-smooth touch-pan-x"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
            <style>{`
              .track-hide-scroll::-webkit-scrollbar { display: none; }
            `}</style>

            {programs.map((program) => {
              const effectiveVisible = Math.min(visibleCards, programs.length)
              const gapPx = visibleCards === 1 ? 0 : visibleCards === 2 ? 16 : 24
              const widthPx = effectiveVisible < visibleCards
                ? Math.floor((pagePx - (gapPx * (effectiveVisible - 1))) / effectiveVisible)
                : cardPx

              return (
                <div
                  key={program.id}
                  className="track-hide-scroll"
                  style={{
                    flex: `0 0 ${widthPx}px`,
                    scrollSnapAlign: 'start',
                  }}
                >
                  <ProgramCard program={program} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mt-4">
          <button
            onClick={prev}
            className="bg-secondary/20 hover:bg-secondary/40 p-2 md:p-3 rounded-full transition-colors"
            aria-label="Previous programs"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>

          <div className="flex gap-2 items-center">
            {Array.from({ length: pagesCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === pageIndex ? 'bg-secondary' : 'bg-white/30'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="bg-secondary/20 hover:bg-secondary/40 p-2 md:p-3 rounded-full transition-colors"
            aria-label="Next programs"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>
      </div>
    </section>
  )
}