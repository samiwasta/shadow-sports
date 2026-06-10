import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Users } from "lucide-react"

import { Card } from "@/components/ui/card"
import { SiteNavbar } from "@/components/site-navbar"
import { createPageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "The Squad",
  description:
    "Meet the Shadow Sports XI. Player profiles, roles, batting order, and season stats for Ratnagiri's cricket club squad.",
  path: "/team",
})

export default function TeamPage() {
  return (
    <div className="relative min-h-screen w-full bg-black">
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div className="mb-10 text-center">
          <p className="font-heading text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
            Shadow Sports · Ratnagiri
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight text-white uppercase md:text-5xl">
            The Squad
          </h1>
        </div>

        <Card
          variant="plus"
          className="max-w-xl rounded-lg border-zinc-800 bg-zinc-950/60"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
              <Users className="size-7 text-blue-400" strokeWidth={1.5} />
            </div>

            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-blue-400 uppercase">
              Squad board in the nets
            </p>

            <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-white uppercase md:text-3xl">
              Profiles on the way
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
              We are lining up every player in the Shadow Sports XI — photos,
              roles, batting order, and season stats. The full squad board goes
              live after the next round of nets.
            </p>

            <p className="mt-6 text-sm text-zinc-500">
              Until then, catch the lads on the photo wall and in match-day
              posts.
            </p>

            <Link
              href="/photo-wall"
              className="font-heading mt-6 text-sm font-semibold tracking-wide text-blue-400 uppercase transition-colors hover:text-blue-300"
            >
              Browse the photo wall
            </Link>

            <Link
              href="/"
              className="font-heading mt-8 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-blue-400 uppercase transition-colors hover:text-blue-300"
            >
              <ArrowLeft className="size-4" />
              Back to the club
            </Link>
          </div>
        </Card>
      </main>

      <SiteNavbar />
    </div>
  )
}
