'use client'
import Script from 'next/script'
import { useMemo, useRef, useState, type ComponentType, type SVGProps, type KeyboardEvent, useEffect, lazy, Suspense } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/app-components/ui/badge'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    Leaf,
    ShieldCheck,
    BarChart3,
    GraduationCap,
    Globe2,
    Building2,
    Handshake,
    ArrowRight,
    Clock,
    Users,
    MapPin,
    Award,
    BookOpen,
    CheckCircle,
    ChevronDown,
    Menu,
    X,
    Bookmark,
    Wallet,
    type LucideIcon,
} from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import type { Program } from '../lib/programs'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app-components/ui/card"


type IconType = ComponentType<SVGProps<SVGSVGElement>>

function iconForProgram(category: string, i: number): LucideIcon {
    const byCategory: Record<string, LucideIcon> = {
        'ESG & Sustainability': Leaf,
        'Risk & Compliance': ShieldCheck,
        'Fraud & Forensics': BarChart3,
        'Service Excellence': Handshake,
        Global: Globe2,
        'Risk & Finance': Building2,
    }
    const fallbacks: LucideIcon[] = [Leaf, ShieldCheck, BarChart3, GraduationCap, Globe2, Building2]
    return byCategory[category] ?? fallbacks[i % fallbacks.length]
}

// Dynamic Icon Component with fallback
function DynamicIcon({ iconName, className, fallback }: { iconName?: string | null, className?: string, fallback?: LucideIcon | ComponentType<SVGProps<SVGSVGElement>> }) {
    // Try to load icon synchronously first
    const getIcon = (): LucideIcon | ComponentType<SVGProps<SVGSVGElement>> => {
        if (!iconName) {
            return fallback || Bookmark
        }

        try {
            // @ts-ignore - Dynamic icon loading
            const icon = LucideIcons[iconName as keyof typeof LucideIcons]
            if (icon && typeof icon === 'function') {
                return icon as LucideIcon
            }
        } catch (error) {
            console.warn(`Failed to load icon: ${iconName}`, error)
        }

        return fallback || Bookmark
    }

    const IconComponent = getIcon()
    return <IconComponent className={className} />
}

// Helper to map Program to View Model
interface ProgramView {
    title: string
    description: string
    category: string
    duration: string
    format: string
    certification?: string
    maxParticipants: number
    level: string
    price: string
    nextSession: string
    image: string
    learningOutcomes: string[]
    whoShouldAttend: string[]
    longDescription: string
    keyPoints: string[]
}

function toProgramView(program: Program): ProgramView {
    return {
        title: program.title,
        description: program.summary,
        category: program.category,
        duration: program.durationDays ? `${program.durationDays} Days` : "",
        format: program.format,
        certification: program.certification || undefined,
        maxParticipants: program.maxParticipants,
        level: program.level,
        price: "Request a quote",
        nextSession: "", // Not in schema currently
        image: program.images.cover,
        learningOutcomes: program.learningOutcomes ?? [],
        whoShouldAttend: program.audience ?? [],
        longDescription: program.longDescription || program.summary,
        keyPoints: program.keyPoints ?? []
    }
}

export function ProgramsExplorer({ programs }: { programs: Program[] }) {
    const [index, _setIndex] = useState(0)
    const prevIndexRef = useRef(0)
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialSlug = searchParams.get('id')
    const detailViewRef = useRef<HTMLDivElement>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [isNavExpanded, setIsNavExpanded] = useState(false)

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
    }, [])

    // Scroll listener for sticky nav styling
    useEffect(() => {
        const handleScroll = () => {
            // Collapse nav if user scrolls down and it was open? optional.
            // For now just toggle layout mode.
            setIsScrolled(window.scrollY > 150)
            if (window.scrollY <= 150) setIsNavExpanded(false)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Effect to handle initial selection from URL
    useEffect(() => {
        if (initialSlug && programs.length > 0) {
            const foundIndex = programs.findIndex(p => p.slug === initialSlug)
            if (foundIndex !== -1 && foundIndex !== index) {
                _setIndex(foundIndex)
                prevIndexRef.current = foundIndex
            }
        }
    }, [initialSlug, programs, index])

    const setIndex = (nextIdx: number) => {
        prevIndexRef.current = nextIdx
        _setIndex(nextIdx)
        const p = programs[nextIdx]
        router.replace(`/programs?id=${p.slug}`, { scroll: false })

        // UX Improvement: Scroll to top of content if below fold
        if (detailViewRef.current) {
            const yOffset = -80;
            const element = detailViewRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

            if (window.scrollY > 400) {
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }

        // Auto-close overlay if open
        setIsNavExpanded(false)
    }

    const onRailKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault()
            setIndex((index + 1) % programs.length)
        }
        else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault()
            setIndex((index - 1 + programs.length) % programs.length)
        }
    }

    const current = programs[index]
    const view = current ? toProgramView(current) : null

    if (!current || !view) return null

    const jsonLdPrograms = programs.map(p => ({
        "@context": "https://schema.org",
        "@type": "Course",
        "name": p.title,
        "description": p.summary,
        "provider": {
            "@type": "Organization",
            "name": "ICCD Nepal",
            "sameAs": "https://iccdnepal.com"
        },
        "courseCode": p.slug,
        "educationalCredentialAwarded": p.certification || undefined,
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": p.format,
            "maximumAttendeeCapacity": p.maxParticipants,
            "duration": p.durationDays ? `${p.durationDays} days` : undefined
        }
    }))

    return (
        <>
        {/* JSON-LD for all programs */}
            <Script type="application/ld+json" id="programs-jsonld">
            {JSON.stringify(jsonLdPrograms)}
            </Script>
            <div className="w-full min-h-screen bg-background flex flex-col">

                {/* HEADER SECTION */}
                <section className="relative px-4 z-40">
                    {/* Subtle background grid + glow blobs */}
                    <div className="absolute inset-0 -z-10 pointer-events-none">
                        {/* Grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

                        {/* Soft glow top left */}
                        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />

                        {/* Soft glow bottom right */}
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-[130px]" />
                    </div>
                    {/* Background lines */}
                    <div className="absolute bottom-0 left-0 w-full h-px lg:top-auto lg:bottom-10" />

                    <div className="max-w-[95%] md:max-w-[90%] mx-auto w-full flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 md:gap-8 py-6 md:py-10">

                        {/* LEFT — Title */}
                        <div className="space-y-2 flex items-center w-full lg:w-auto">
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                                Our <span className="text-white">Programs</span>
                            </h1>
                        </div>

                        {/* RIGHT — Adaptive Navigation */}
                        <div className="w-full lg:w-auto flex flex-col items-end">

                            {/* 
                            STATE 1: Full List (Not Scrolled) 
                            Only visible when NOT scrolled. Fade out when scrolled.
                        */}
                            <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0 pointer-events-none hidden lg:block' : 'opacity-100'} hidden lg:block`}>
                                <div className="flex flex-col items-end space-y-2">
                                    {programs.map((p, i) => {
                                        const active = i === index
                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => setIndex(i)}
                                                className={`group relative flex items-center justify-end gap-3 w-fit transition-all outline-none py-1
                                                ${active ? 'opacity-100' : 'opacity-60 hover:opacity-90'}
                                            `}
                                            >
                                                <span className={`text-right text-base font-medium transition-colors duration-300 ${active ? 'text-white' : 'text-slate-300'}`}>
                                                    {p.title}
                                                </span>
                                                <div className="relative flex items-center justify-center w-4 h-4">
                                                    {active && (
                                                        <motion.div
                                                            layoutId="active-indicator-static"
                                                            className="absolute inset-0 bg-secondary rounded-full"
                                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                        />
                                                    )}
                                                    {active && <div className="absolute w-1.5 h-1.5 bg-white rounded-full z-10" />}
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* 
                            STATE 2: Bookmark/Toggle Bar (Scrolled or Mobile)
                       */}
                            <AnimatePresence>
                                {(isScrolled || isMobile) && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="fixed top-4 md:top-6 right-4 md:right-6 lg:right-12 z-50 flex items-center gap-3 md:gap-4"
                                    >
                                        {/* Current Program Label (Optional context) */}
                                        {!isNavExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="hidden md:block px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 text-xs md:text-sm text-slate-300 max-w-[200px] truncate"
                                            >
                                                <span className="text-secondary mr-2">Viewing:</span> {current.title}
                                            </motion.div>
                                        )}

                                        {/* Bookmark Toggle Button */}
                                        <button
                                            onClick={() => setIsNavExpanded(!isNavExpanded)}
                                            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                                        >
                                            {isNavExpanded ? <X className="w-4 h-4 md:w-5 md:h-5" /> : <DynamicIcon iconName={current.images.icon} className="w-4 h-4 md:w-5 md:h-5" fallback={iconForProgram(current.category, index)} />}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* 
                            STATE 3: Expanded Overlay List (When Toggled)
                        */}
                            <AnimatePresence>
                                {(isScrolled || isMobile) && isNavExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, x: 20 }}
                                        className="fixed top-16 md:top-20 lg:top-24 right-4 md:right-6 lg:right-12 z-40 max-h-[70vh] md:max-h-[80vh] overflow-y-auto"
                                    >
                                        <div
                                            className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl shadow-2xl flex flex-col items-end space-y-2 min-w-[200px] md:min-w-[250px]"
                                            role="tablist"
                                            tabIndex={0}
                                            onKeyDown={onRailKey}
                                        >
                                            <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2 w-full text-right border-b border-white/5 pb-2">Select Program</div>
                                            {programs.map((p, i) => {
                                                const active = i === index
                                                return (
                                                    <button
                                                        key={p.id}
                                                        role="tab"
                                                        aria-selected={active}
                                                        onClick={() => setIndex(i)}
                                                        className={`group relative flex items-center justify-between gap-2 md:gap-3 w-full transition-all outline-none py-2 px-2 md:px-3 rounded-lg
                                                        ${active ? 'bg-white/5' : 'hover:bg-white/5'}
                                                    `}
                                                    >
                                                        {/* Program Icon */}
                                                        <div className={`p-1 md:p-1.5 rounded-lg transition-colors ${active ? 'bg-secondary/20 text-secondary' : 'bg-white/5 text-slate-400'
                                                            }`}>
                                                            <DynamicIcon iconName={p.images.icon} className="w-3 h-3 md:w-4 md:h-4" fallback={iconForProgram(p.category, i)} />
                                                        </div>

                                                        <span className={`flex-1 text-right text-xs md:text-sm lg:text-base font-medium transition-colors duration-300
                                                        ${active ? 'text-white' : 'text-slate-300'}
                                                    `}>
                                                            {p.title}
                                                        </span>

                                                        {/* Active Pill Indicator */}
                                                        <div className="relative flex items-center justify-center w-3 h-3 md:w-4 md:h-4 shrink-0">
                                                            {active && (
                                                                <motion.div
                                                                    layoutId="active-indicator-overlay"
                                                                    className="absolute inset-0 bg-secondary rounded-full"
                                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                                />
                                                            )}
                                                            {active && <div className="absolute w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full z-10" />}
                                                        </div>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </div>
                </section>


                {/* MAIN CONTENT - Detail View */}
                <div className="flex-1 bg-background relative pb-12 md:pb-16 lg:pb-20 mt-2" ref={detailViewRef}>
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-full"
                        >
                            {/* Hero Section */}
                            <div className="relative w-full h-[250px] md:h-[300px] lg:h-[350px]">
                                <div className="absolute inset-0">
                                    <img src={view.image} alt={view.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 lg:p-4">
                                    <div className="w-[95%] md:w-[90%] mx-auto">
                                        <div className="flex flex-wrap gap-2 md:gap-3 mb-3 md:mb-4">
                                            <Badge className="bg-secondary text-white hover:bg-secondary/90 rounded-full border-none text-xs md:text-sm">
                                                {view.category}
                                            </Badge>
                                            <Badge variant="outline" className={`bg-black/20 text-white rounded-full border-white/20 backdrop-blur-sm text-xs md:text-sm`}>
                                                {view.level}
                                            </Badge>
                                        </div>
                                        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
                                            {view.title}
                                        </h1>
                                        <p className="text-sm md:text-base lg:text-lg text-slate-200 max-w-4xl">
                                            {view.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="max-w-[95%] md:max-w-[90%] mx-auto px-4 md:px-6 lg:px-4 py-6 md:py-8">
                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12 p-4 md:p-6 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <div className="p-1.5 md:p-2 rounded-full bg-secondary/10 text-secondary">
                                                <Clock className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs text-slate-400 mb-0.5">Duration</div>
                                                <div className="font-semibold text-white text-xs md:text-sm">{view.duration || 'Flexible'}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <div className="p-1.5 md:p-2 rounded-full bg-secondary/10 text-secondary">
                                                <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs text-slate-400 mb-0.5">Max Participants</div>
                                                <div className="font-semibold text-white text-xs md:text-sm">{view.maxParticipants} Max</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-start gap-2 md:gap-3">
                                            <div className="p-1.5 md:p-2 rounded-full bg-secondary/10 text-secondary">
                                                <MapPin className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs text-slate-400 mb-0.5">Format</div>
                                                <div className="font-semibold text-white text-xs md:text-sm">{view.format}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {view.certification && (
                                        <div className="space-y-1 col-span-2 md:col-span-1">
                                            <div className="flex items-start gap-2 md:gap-3">
                                                <div className="p-1.5 md:p-2 rounded-full bg-secondary/10 text-secondary">
                                                    <Award className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] md:text-xs text-slate-400 mb-0.5">Certification</div>
                                                    <div className="font-semibold text-white text-xs md:text-sm truncate" title={view.certification}>{view.certification}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                                    {/* Main Content Info */}
                                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                                        {/* Long Description */}
                                        <Card className="bg-slate-900/50 border-white/10 rounded-2xl">
                                            <CardHeader>
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                                    <CardTitle className="text-lg md:text-xl text-primary">Program Overview</CardTitle>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                                                    {view.longDescription}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Key Points (fallback if no outcomes) */}
                                        {view.keyPoints.length > 0 && view.learningOutcomes.length === 0 && (
                                            <Card className="bg-slate-900/50 border-white/10 rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle className="text-lg md:text-xl text-primary">Key Highlights</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-3">
                                                        {view.keyPoints.map((pt, k) => (
                                                            <li key={k} className="flex gap-2 md:gap-3 text-slate-300 text-sm md:text-base">
                                                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary shrink-0 mt-0.5" />
                                                                <span>{pt}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Side Widgets */}
                                    <div className="space-y-6">
                                        {/* Who Should Attend */}
                                        {view.whoShouldAttend.length > 0 && (
                                            <Card className="bg-slate-900/50 border-white/10 rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle className="text-base md:text-lg text-primary">Who Should Attend</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-2">
                                                        {view.whoShouldAttend.map((role, index) => (
                                                            <li key={index} className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
                                                                <div className="w-1.5 h-1.5 bg-secondary rounded-full" />
                                                                <span>{role}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Learning Outcomes */}
                                        {view.learningOutcomes.length > 0 && (
                                            <Card className="bg-slate-900/50 border-white/10 rounded-2xl">
                                                <CardHeader>
                                                    <CardTitle className="text-base md:text-lg text-primary">Learning Outcomes</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-3">
                                                        {view.learningOutcomes.map((outcome, index) => (
                                                            <li key={index} className="flex items-start gap-2 text-xs md:text-sm text-slate-300">
                                                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-secondary mt-0.5 flex-shrink-0" />
                                                                <span>{outcome}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </>
    )
}