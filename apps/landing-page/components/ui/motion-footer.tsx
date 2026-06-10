"use client"

import * as React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowUp } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 3%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 1%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 8%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 8%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, #3b82f6 45%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 12px color-mix(in oklch, #60a5fa 75%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, #3b82f6 14%, transparent) 0%,
    color-mix(in oklch, var(--primary) 12%, transparent) 35%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
      0 10px 30px -10px var(--pill-shadow),
      inset 0 1px 1px var(--pill-highlight),
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
      0 20px 40px -10px var(--pill-shadow-hover),
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

.footer-giant-bg-text {
  font-size: 26vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, #60a5fa 12%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, #93c5fd 8%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  display: block;
  line-height: 1.15;
  padding: 0.25em 0 0.12em;
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, #60a5fa 45%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 4px 24px color-mix(in oklch, #3b82f6 18%, transparent));
}

.footer-badge {
  border: 1px solid color-mix(in oklch, #3b82f6 28%, transparent);
  background: linear-gradient(
    145deg,
    color-mix(in oklch, #3b82f6 10%, transparent) 0%,
    color-mix(in oklch, var(--foreground) 2%, transparent) 100%
  );
  box-shadow: 0 0 28px color-mix(in oklch, #3b82f6 12%, transparent);
}

.footer-accent-pill {
  border-color: color-mix(in oklch, #3b82f6 35%, transparent) !important;
  box-shadow:
    0 10px 30px -10px color-mix(in oklch, #3b82f6 20%, transparent),
    inset 0 1px 1px color-mix(in oklch, #93c5fd 15%, transparent);
}
`

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType
  }

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null)

    useEffect(() => {
      if (typeof window === "undefined") return
      const element = localRef.current
      if (!element) return

      const ctx = gsap.context(() => {
        const handleMouseMove = (event: MouseEvent) => {
          const rect = element.getBoundingClientRect()
          const centerX = rect.width / 2
          const centerY = rect.height / 2
          const x = event.clientX - rect.left - centerX
          const y = event.clientY - rect.top - centerY

          gsap.to(element, {
            x: x * 0.4,
            y: y * 0.4,
            rotationX: -y * 0.15,
            rotationY: x * 0.15,
            scale: 1.05,
            ease: "power2.out",
            duration: 0.4,
          })
        }

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          })
        }

        element.addEventListener("mousemove", handleMouseMove)
        element.addEventListener("mouseleave", handleMouseLeave)

        return () => {
          element.removeEventListener("mousemove", handleMouseMove)
          element.removeEventListener("mouseleave", handleMouseLeave)
        }
      }, element)

      return () => ctx.revert()
    }, [])

    return (
      <Component
        ref={(node: HTMLElement) => {
          localRef.current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) {
            forwardedRef.current = node
          }
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    )
  },
)
MagneticButton.displayName = "MagneticButton"

const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    <span className="text-neutral-400">Weekly Nets</span>{" "}
    <span className="text-blue-400/70">✦</span>
    <span className="text-neutral-300">Match Day</span>{" "}
    <span className="text-blue-400/70">✦</span>
    <span className="text-neutral-400">Club Training</span>{" "}
    <span className="text-blue-400/70">✦</span>
    <span className="text-neutral-300">Team Spirit</span>{" "}
    <span className="text-blue-400/70">✦</span>
    <span className="text-neutral-400">#1 in Ratnagiri</span>{" "}
    <span className="text-blue-400/70">✦</span>
  </div>
)

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const giantTextRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!wrapperRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      )

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div
        ref={wrapperRef}
        id="cinematic-footer"
        className="relative h-screen w-full"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="cinematic-footer-wrapper font-heading fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-background text-foreground">
          <div className="footer-aurora pointer-events-none absolute left-1/2 top-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          <div
            ref={giantTextRef}
            className="footer-giant-bg-text pointer-events-none absolute -bottom-[5vh] left-1/2 z-0 -translate-x-1/2 whitespace-nowrap select-none"
          >
            SHADOW SPORTS
          </div>

          <div className="absolute top-12 left-0 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-blue-500/20 bg-background/70 py-4 shadow-2xl shadow-blue-500/5 backdrop-blur-md">
            <div className="flex w-max animate-footer-scroll-marquee text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center overflow-visible px-6 pb-6 pt-28 md:pt-32">
            <h2
              ref={headingRef}
              className="mb-12 overflow-visible text-center text-5xl font-black leading-[1.15] tracking-tight md:text-8xl"
            >
              <span className="footer-text-glow">Ready to play?</span>
            </h2>

            <div ref={linksRef} className="flex w-full flex-col items-center gap-6">
              <div className="flex w-full flex-wrap justify-center gap-4">
                <MagneticButton
                  as="a"
                  href="#contact"
                  className="footer-glass-pill footer-accent-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
                >
                  Join the Club
                </MagneticButton>

                <MagneticButton
                  as="a"
                  href="/photo-wall"
                  className="footer-glass-pill group flex items-center gap-3 rounded-full px-10 py-5 text-sm font-bold text-foreground md:text-base"
                >
                  View Photo Wall
                </MagneticButton>
              </div>

              <div className="mt-2 flex w-full flex-wrap justify-center gap-3 md:gap-6">
                <MagneticButton
                  as="a"
                  href="#features"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  Features
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#story"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  Our Story
                </MagneticButton>
                <MagneticButton
                  as="a"
                  href="#contact"
                  className="footer-glass-pill rounded-full px-6 py-3 text-xs font-medium text-muted-foreground hover:text-foreground md:text-sm"
                >
                  Contact
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="relative z-20 grid w-full grid-cols-1 items-center gap-4 px-6 pb-8 md:grid-cols-3 md:px-12">
            <p className="text-center text-[10px] font-semibold tracking-widest text-blue-400/50 uppercase md:text-left md:text-xs">
              © 2026 Shadow Sports. All rights reserved.
            </p>

            <div className="flex justify-center">
              <div className="footer-glass-pill footer-badge flex cursor-default items-center justify-center gap-2 rounded-full px-6 py-3 text-center">
                <span className="text-[10px] font-bold tracking-widest text-neutral-300 uppercase md:text-xs">
                  Built for cricketers who play for the badge
                </span>
                <span className="animate-footer-heartbeat shrink-0 text-sm text-blue-400 md:text-base">
                  ✦
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <MagneticButton
                as="button"
                onClick={scrollToTop}
                className="footer-glass-pill group flex h-12 w-12 items-center justify-center rounded-full text-blue-400/70 hover:text-blue-300"
              >
                <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1.5" />
              </MagneticButton>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
