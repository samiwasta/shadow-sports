"use client"

import { ChevronDown } from "lucide-react"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import Image from "next/image"
import { useRef, useSyncExternalStore } from "react"

import { cn } from "@workspace/ui/lib/utils"

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}

interface SectionProps {
  scrollYProgress: MotionValue<number>
}

const gridOverlay =
  "absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"

const clubStats = [
  { label: "Active Players", value: "20+" },
  { label: "Matches Played", value: "50+" },
  { label: "Club Seasons", value: "6" },
]

const photoWallImages = [
  {
    src: "/team-2.jpg",
    alt: "Shadow Sports cricket team celebrating with the trophy",
    className: "col-span-2 row-span-2 h-full min-h-64",
  },
  {
    src: "/team-1.jpeg",
    alt: "Shadow Sports cricket team at Belapur Terminal",
    className: "col-span-1 min-h-48",
  },
  {
    src: "/team-4.jpg",
    alt: "Shadow Sports cricketer in batting stance at the nets",
    className: "col-span-1 min-h-48",
  },
  {
    src: "/team-3.jpg",
    alt: "Shadow Sports batsman playing a shot",
    className: "col-span-2 min-h-52",
  },
]

const headlineContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
}

const headlineItem = {
  hidden: { opacity: 0, y: 48, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
}

function Section1({ scrollYProgress }: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 22 })
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 22 })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.88])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -4])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.35])

  const orb1X = useTransform(smoothX, [-0.5, 0.5], [-40, 40])
  const orb1Y = useTransform(smoothY, [-0.5, 0.5], [-30, 30])
  const orb2X = useTransform(smoothX, [-0.5, 0.5], [30, -30])
  const orb2Y = useTransform(smoothY, [-0.5, 0.5], [25, -25])
  const contentX = useTransform(smoothX, [-0.5, 0.5], [-12, 12])
  const contentY = useTransform(smoothY, [-0.5, 0.5], [-8, 8])

  function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return

    mouseX.set((event.clientX - rect.left - rect.width / 2) / rect.width)
    mouseY.set((event.clientY - rect.top - rect.height / 2) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale, rotate, opacity: heroOpacity }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="sticky top-0 flex min-h-svh h-svh w-full flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-8 text-foreground"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950" />
      <div className={cn("absolute inset-0", gridOverlay)} />

      <motion.div
        style={{ x: orb1X, y: orb1Y }}
        className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-blue-600/25 blur-[100px]"
      />
      <motion.div
        style={{ x: orb2X, y: orb2Y }}
        className="pointer-events-none absolute right-1/4 -bottom-16 size-96 rounded-full bg-blue-500/15 blur-[120px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.12),transparent_55%)]" />

      <motion.div
        style={{ x: contentX, y: contentY }}
        className="relative z-10 flex max-w-5xl flex-col items-center text-center"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          className="font-heading mb-6 inline-flex cursor-default items-center gap-3 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-xs font-bold tracking-[0.25em] text-blue-300 uppercase shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        >
          <motion.span
            animate={{ scale: [1, 1.35, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="size-2.5 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(96,165,250,0.9)]"
          />
          Elite Cricket Club
        </motion.span>

        <motion.h1
          variants={headlineContainer}
          initial="hidden"
          animate="show"
          className="font-heading text-5xl leading-[0.95] font-bold tracking-tight uppercase sm:text-6xl md:text-7xl xl:text-8xl"
        >
          <motion.span variants={headlineItem} className="block">
            Built in the nets.
          </motion.span>
          <motion.span
            variants={headlineItem}
            className="mt-2 block bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent"
          >
            Made for match day.
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg"
        >
          Shadow Sports is your cricket club — connect with teammates, track
          every innings, and celebrate every wicket together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.a
            href="#join"
            whileHover={{
              scale: 1.06,
              boxShadow: "0 0 40px rgba(255,255,255,0.25)",
            }}
            whileTap={{ scale: 0.97 }}
            className="font-heading rounded-full bg-white px-8 py-4 text-sm font-bold tracking-widest text-black uppercase"
          >
            Join the Club
          </motion.a>
          <motion.a
            href="#photo-wall"
            whileHover={{
              scale: 1.06,
              borderColor: "rgba(96,165,250,0.6)",
              backgroundColor: "rgba(59,130,246,0.12)",
            }}
            whileTap={{ scale: 0.97 }}
            className="font-heading rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold tracking-widest text-foreground uppercase backdrop-blur-sm"
          >
            View Photo Wall
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="mt-8 grid w-full max-w-2xl grid-cols-3 gap-3"
        >
          {clubStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -6, scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="cursor-default rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm"
            >
              <p className="font-heading text-2xl font-bold text-white md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[10px] tracking-wider text-neutral-500 uppercase md:text-xs">
                {stat.label}
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                className="mt-3 h-0.5 origin-left rounded-full bg-gradient-to-r from-blue-500 to-transparent"
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 flex flex-col items-center gap-2 text-neutral-500"
        >
          <span className="font-heading text-[10px] tracking-[0.35em] uppercase">
            Scroll to explore
          </span>
          <ChevronDown className="size-5" />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

function Section2({ scrollYProgress }: SectionProps) {
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const rotate = useTransform(scrollYProgress, [0, 1], [4, 0])

  return (
    <motion.section
      id="photo-wall"
      style={{ scale, rotate }}
      className="relative flex min-h-screen items-center bg-gradient-to-b from-neutral-900 via-neutral-950 to-black py-24 text-foreground"
    >
      <div className={gridOverlay} />

      <article className="relative z-10 container mx-auto px-6">
        <p className="font-heading mb-3 text-xs font-semibold tracking-[0.25em] text-blue-400 uppercase">
          Photo Wall
        </p>
        <h2 className="font-heading mb-4 max-w-3xl text-4xl leading-tight font-semibold tracking-tight uppercase md:text-5xl">
          Every innings. Every wicket. Every memory.
        </h2>
        <p className="mb-10 max-w-2xl text-muted-foreground">
          From trophy nights to net sessions — every moment that makes Shadow
          Sports more than just a team, captured in one place for the whole club.
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {photoWallImages.map((image) => (
            <motion.div
              key={image.src}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className={cn(
                "group overflow-hidden rounded-xl border border-white/10 bg-neutral-900",
                image.className,
              )}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={800}
                height={600}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
            </motion.div>
          ))}
        </div>
      </article>
    </motion.section>
  )
}

function HeroScrollAnimation() {
  const isClient = useIsClient()
  const container = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  if (!isClient) {
    return (
      <div className="relative h-[200vh] bg-black">
        <section className="sticky top-0 flex min-h-svh h-svh w-full flex-col items-center justify-center bg-neutral-950 px-6 pt-24">
          <h1 className="font-heading text-center text-6xl font-bold tracking-tight uppercase md:text-7xl">
            Built in the nets.
            <br />
            <span className="text-blue-300">Made for match day.</span>
          </h1>
        </section>
      </div>
    )
  }

  return (
    <main ref={container} className="relative h-[200vh] bg-black">
      <Section1 scrollYProgress={scrollYProgress} />
      <Section2 scrollYProgress={scrollYProgress} />
      <footer className="group bg-black">
        <h2 className="font-heading translate-y-16 text-center text-[14vw] leading-none font-semibold tracking-tight text-neutral-800 uppercase transition-all ease-linear group-hover:text-neutral-700 md:text-[12vw]">
          Shadow Sports
        </h2>
        <div className="relative z-10 grid h-40 place-content-center rounded-t-full bg-neutral-950 text-sm text-muted-foreground">
          Built for cricketers who play for the badge.
        </div>
      </footer>
    </main>
  )
}

export default HeroScrollAnimation
