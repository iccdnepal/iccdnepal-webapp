'use client';

import Link from 'next/link';
import { Badge } from '@/app-components/ui/badge';

export default function HeroTrainMyTeam() {

  return (
    <section
      className="relative isolate w-[95%] md:max-w-7xl mx-auto rounded-2xl md:rounded-4xl overflow-hidden my-6 md:my-12"
      aria-labelledby="hero-title"
    >
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/Images/Stocks/bg.png"
          alt=""
          className="h-full w-full object-cover object-center md:object-left"
        />
      </div>

      {/* Content */}
      <div className="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        <div className="text-center md:text-left max-w-2xl w-full md:w-auto">
          <Badge
            variant="secondary"
            className="bg-white/10 text-white rounded-full border-white/20 hover:bg-white/20 mb-3 text-xs sm:text-sm"
          >
            For HR leaders
          </Badge>

          <h1
            id="hero-title"
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-white mb-2 sm:mb-3 md:mb-2"
          >
            Scale Training Across Your Institution
          </h1>

          <p className="text-primary-foreground/90 text-sm sm:text-base md:text-lg max-w-xl mx-auto md:mx-0">
            Unlock the full potential of your teams with a comprehensive
            learning program built for compliance, capability and culture.
          </p>
        </div>

        <div className="flex-shrink-0 w-full md:w-auto flex justify-center md:justify-end">
          <Link
            href="/programs"
            className="group relative inline-flex items-center justify-center rounded-full bg-secondary px-6 py-2.5 sm:px-7 sm:py-3 md:px-8 md:py-3 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:bg-secondary hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-primary w-full sm:w-auto max-w-xs md:max-w-none"
          >
            Train My Team
          </Link>
        </div>
      </div>
    </section>

  );
}