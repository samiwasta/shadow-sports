import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, LogIn } from "lucide-react"

import { Card } from "@/components/ui/card"
import { SiteNavbar } from "@/components/site-navbar"
import { createPageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Member Login",
  description:
    "Sign in to the Shadow Sports member portal for player accounts, squad updates, fixtures, and match-day access.",
  path: "/login",
})

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-black">
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div className="mb-10 text-center">
          <p className="font-heading text-xs font-semibold tracking-[0.2em] text-blue-400 uppercase">
            Shadow Sports · Ratnagiri
          </p>
          <h1 className="font-heading mt-3 text-4xl font-bold tracking-tight text-white uppercase md:text-5xl">
            Member Login
          </h1>
        </div>

        <Card
          variant="plus"
          className="max-w-xl rounded-lg border-zinc-800 bg-zinc-950/60"
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex size-14 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10">
              <LogIn className="size-7 text-blue-400" strokeWidth={1.5} />
            </div>

            <p className="font-heading text-xs font-semibold tracking-[0.18em] text-blue-400 uppercase">
              Pavilion access loading
            </p>

            <h2 className="font-heading mt-3 text-2xl font-bold tracking-tight text-white uppercase md:text-3xl">
              Login on the way
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
              We are setting up the member portal for Shadow Sports — player
              accounts, squad updates, fixtures, and match-day access all in one
              place.
            </p>

            <p className="mt-6 text-sm text-zinc-500">
              Until then, get in touch with the club or follow us on match day.
            </p>

            <Link
              href="/contact"
              className="font-heading mt-6 text-sm font-semibold tracking-wide text-blue-400 uppercase transition-colors hover:text-blue-300"
            >
              Contact the club
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
