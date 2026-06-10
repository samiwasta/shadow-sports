import { MarqueeAnimation } from "@/components/ui/marquee-effect"

export default function MarqueeSection() {
  return (
    <section
      aria-hidden
      className="relative z-10 w-full overflow-hidden border-y border-blue-500/20 bg-black py-6 md:py-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]" />
      <div className="relative flex flex-col gap-3 md:gap-4">
        <MarqueeAnimation
          direction="left"
          baseVelocity={3}
          className="font-heading py-3 text-5xl font-bold uppercase text-blue-400 md:text-6xl lg:text-7xl"
        >
          Shadow Sports — Nets — Match Day — Training — Community —
        </MarqueeAnimation>
        <MarqueeAnimation
          direction="right"
          baseVelocity={3}
          className="font-heading py-3 text-5xl font-bold uppercase text-white md:text-6xl lg:text-7xl"
        >
          #1 Cricket Club in Ratnagiri — Practice — Play — Train — Win — Join the Club —
        </MarqueeAnimation>
      </div>
    </section>
  )
}
