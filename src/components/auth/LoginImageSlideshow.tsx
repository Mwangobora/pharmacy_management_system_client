'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pill } from 'lucide-react'
import { cn } from '@/lib/utils'

const SLIDESHOW_INTERVAL_MS = 3000

const LOGIN_SLIDES = [
  {
    src: '/images/med.jpg',
    alt: 'Pharmacist reviewing medicines on a pharmacy shelf.',
  },
  {
    src: '/images/med1.jpg',
    alt: 'Pharmacist standing in a bright aisle of pharmacy inventory.',
  },
  {
    src: '/images/med_pic.jpg',
    alt: 'Blister packs of colorful medicine capsules and tablets.',
  },
  {
    src: '/images/med4.jpg',
    alt: 'Pharmacist preparing a prescription in a modern pharmacy.',
  },
  {
    src: '/images/med6.jpeg',
    alt: 'Pharmacist using a digital tablet to manage pharmacy inventory.',
  }

] as const

function getInitialReducedMotionPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function LoginImageSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDocumentVisible, setIsDocumentVisible] = useState(() => (
    typeof document === 'undefined' ? true : document.visibilityState === 'visible'
  ))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialReducedMotionPreference)

  const nextIndex = useMemo(
    () => (activeIndex + 1) % LOGIN_SLIDES.length,
    [activeIndex]
  )

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    const handleVisibilityChange = () => {
      setIsDocumentVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleMediaChange)
    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const image = new window.Image()
    image.src = LOGIN_SLIDES[nextIndex].src

    return undefined
  }, [nextIndex])

  useEffect(() => {
    if (!isDocumentVisible || LOGIN_SLIDES.length < 2) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % LOGIN_SLIDES.length)
    }, SLIDESHOW_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [isDocumentVisible])

  return (
    <aside className="relative hidden min-h-screen overflow-hidden border-r border-border/60 bg-slate-950 text-white md:flex md:w-[44%] lg:w-1/2">
      <div className="absolute inset-0">
        {LOGIN_SLIDES.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={cn(
              'absolute inset-0 h-full w-full object-cover',
              prefersReducedMotion
                ? 'transition-none'
                : 'transition-opacity duration-700 ease-out',
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,10,20,0.25)_0%,rgba(4,10,20,0.62)_52%,rgba(4,10,20,0.84)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.28),transparent_42%)]" />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-between p-8 md:p-10 xl:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Pill className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">PharmaCare Enterprise</span>
        </div>

        <div className="max-w-xl space-y-6">
          <blockquote className="space-y-3">
            <p className="text-2xl font-medium leading-normal xl:text-[2rem]">
              &ldquo;Streamline your pharmacy operations with our comprehensive management system.
              From inventory tracking to seamless staff management.&rdquo;
            </p>
            <footer className="max-w-lg text-base text-slate-200/85">
              Reliable infrastructure for modern healthcare.
            </footer>
          </blockquote>

          <div className="flex items-center gap-2">
            {LOGIN_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show login slide ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'h-2.5 rounded-full border border-white/25 transition-all duration-300',
                  index === activeIndex
                    ? 'w-8 bg-primary shadow-sm shadow-primary/40'
                    : 'w-2.5 bg-white/35 hover:bg-white/55'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
