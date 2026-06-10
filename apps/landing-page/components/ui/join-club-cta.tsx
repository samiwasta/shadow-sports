"use client"

import { ArrowRight, Check } from "lucide-react"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"
import { useRef } from "react"

import { cn } from "@workspace/ui/lib/utils"

const perks = [
  "Weekly nets & practice sessions",
  "League and friendly matches",
  "Full squad access & club events",
]

export default function JoinClubCta() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 })

  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${smoothX}px ${smoothY}px, rgba(59,130,246,0.28), transparent 65%)`

  const tiltX = useTransform(smoothY, (y) => {
    const height = cardRef.current?.offsetHeight ?? 400
    return ((y / height) - 0.5) * -10
  })
  const tiltY = useTransform(smoothX, (x) => {
    const width = cardRef.current?.offsetWidth ?? 600
    return ((x / width) - 0.5) * 10
  })

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  function handleMouseLeave() {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(rect.width / 2)
    mouseY.set(rect.height / 2)
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative z-10 w-full overflow-hidden bg-black px-6 py-24 md:py-32"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_50%,transparent_100%)]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/4 size-72 rounded-full bg-blue-500/20 blur-[100px]"
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-1/4 bottom-1/4 size-80 rounded-full bg-blue-400/15 blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-10 text-center"
        >
          <p className="font-heading mb-4 text-sm font-semibold tracking-[0.25em] text-blue-400 uppercase md:text-base">
            Membership
          </p>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-foreground uppercase md:text-5xl lg:text-6xl">
            Join the Club
          </h2>
        </motion.div>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 60, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.1 }}
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 1200,
            transformStyle: "preserve-3d",
          }}
          className="group relative"
        >
          <div className="absolute -inset-[2px] overflow-hidden rounded-3xl">
            <motion.div
              className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,#3b82f6_60deg,#60a5fa_120deg,#2563eb_180deg,transparent_240deg)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-neutral-950/90 p-8 backdrop-blur-xl md:p-12">
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-80"
              style={{ background: spotlight }}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                className="font-heading mb-2 flex items-baseline gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <span className="text-2xl font-semibold text-blue-300 md:text-3xl">
                  Rs
                </span>
                <span className="bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-[length:200%_auto] bg-clip-text text-7xl font-bold tracking-tight text-transparent md:text-8xl lg:text-9xl animate-[shimmer_3s_linear_infinite]">
                  500
                </span>
              </motion.div>
              <p className="font-heading mb-8 text-lg font-semibold tracking-wide text-muted-foreground uppercase md:text-xl">
                Per Month
              </p>

              <p className="mx-auto mb-8 max-w-lg text-base text-muted-foreground md:text-lg">
                Become a Shadow Sports member and play with Ratnagiri&apos;s top
                cricket club. Nets, matches, and training — all in one membership.
              </p>

              <ul className="mb-10 flex w-full max-w-md flex-col gap-3 text-left">
                {perks.map((perk, index) => (
                  <motion.li
                    key={perk}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3 text-sm text-foreground md:text-base"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                      <Check className="size-3.5" />
                    </span>
                    {perk}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "font-heading group/btn relative overflow-hidden rounded-full px-10 py-4 text-base font-bold tracking-wider text-black uppercase md:px-14 md:py-5 md:text-lg",
                  "bg-white shadow-[0_0_40px_rgba(59,130,246,0.45)]",
                  "transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(96,165,250,0.65)]",
                )}
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/60 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Join the Club
                  <ArrowRight className="size-5 transition-transform group-hover/btn:translate-x-1" />
                </span>
              </motion.button>

              <p className="mt-5 text-xs text-muted-foreground">
                Cancel anytime. No hidden fees.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
