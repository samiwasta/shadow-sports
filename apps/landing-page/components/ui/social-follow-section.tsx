"use client"

import { motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/shadowsports__official",
    hoverClass: "hover:border-pink-500/50 hover:shadow-pink-500/20 hover:text-pink-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com/shadowsportscricketclub",
    hoverClass: "hover:border-blue-500/50 hover:shadow-blue-500/20 hover:text-blue-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
        <path d="M14 8.5V7.25c0-.69.56-1.25 1.25-1.25H17V3h-2.5C12.57 3 11 4.57 11 6.5V8.5H8v3h3V21h3v-9.5h2.75L17.5 8.5H14z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@ShadowSports.Official",
    hoverClass: "hover:border-red-500/50 hover:shadow-red-500/20 hover:text-red-400",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
        <path d="M21.58 7.2a2.5 2.5 0 0 0-1.76-1.77C18.1 5 12 5 12 5s-6.1 0-7.82.43a2.5 2.5 0 0 0-1.76 1.77C2 8.92 2 12 2 12s0 3.08.42 4.8a2.5 2.5 0 0 0 1.76 1.77C5.9 19 12 19 12 19s6.1 0 7.82-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.08 22 12 22 12s0-3.08-.42-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
] as const

export default function SocialFollowSection() {
  return (
    <section className="relative z-10 w-full bg-black px-6 pb-24 pt-4 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.08),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <p className="font-heading mb-3 text-sm font-semibold tracking-[0.25em] text-blue-400 uppercase md:text-base">
            Stay Connected
          </p>
          <h2 className="font-heading mb-3 text-3xl font-bold tracking-tight text-foreground uppercase md:text-4xl">
            Follow Us on Socials
          </h2>
          <p className="mx-auto mb-10 max-w-md text-muted-foreground">
            Match highlights, training clips, and club updates — follow Shadow
            Sports online.
          </p>
        </motion.div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          {SOCIALS.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 120 }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "font-heading flex w-full max-w-[200px] flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 px-8 py-6 text-foreground uppercase transition-shadow duration-300",
                "shadow-lg shadow-black/30",
                social.hoverClass,
              )}
            >
              {social.icon}
              <span className="text-sm font-bold tracking-wider">{social.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
