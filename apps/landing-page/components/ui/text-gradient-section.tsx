"use client"

import { useScroll } from "motion/react"
import { useRef } from "react"

import { TextGradientScroll } from "@/components/ui/text-gradient-scroll"

const SHADOW_SPORTS_COPY =
  "Shadow Sports is where your cricket club lives — from the first ball in the nets to the last wicket on match day. Track every innings, celebrate every win, and build a legacy that lasts season after season."

export default function TextGradientSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })

  return (
    <section id="story" className="relative z-10 w-full bg-black">
      <div ref={scrollRef} className="relative min-h-[200vh]">
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="relative z-10 flex h-full items-center justify-center px-6 py-24">
            <div className="mx-auto w-full max-w-5xl text-center">
              <p className="font-heading mb-8 text-center text-sm font-semibold tracking-[0.25em] text-blue-400 uppercase md:text-base">
                Our Story
              </p>
              <TextGradientScroll
                text={SHADOW_SPORTS_COPY}
                type="letter"
                textOpacity="soft"
                progress={scrollYProgress}
                className="font-heading justify-center text-center text-3xl leading-snug font-semibold tracking-tight text-foreground uppercase md:text-4xl lg:text-5xl xl:text-6xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
