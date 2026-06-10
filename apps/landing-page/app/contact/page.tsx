import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import ContactForm from "@/components/ui/contact-form"
import { SiteNavbar } from "@/components/site-navbar"
import { createPageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Get in touch with Shadow Sports in Ratnagiri. Enquire about membership, match fixtures, training, events, or club partnerships.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_45%,transparent_100%)]" />
      <div className="pointer-events-none absolute top-1/4 left-1/3 size-72 rounded-full bg-blue-500/15 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 size-80 rounded-full bg-blue-400/10 blur-[120px]" />

      <main className="relative mx-auto w-full max-w-6xl px-6 py-32 md:py-36">
        <Link
          href="/"
          className="font-heading mb-10 inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-400 uppercase transition-colors hover:text-blue-300"
        >
          <ArrowLeft className="size-3.5" />
          Back to the club
        </Link>

        <ContactForm />
      </main>

      <SiteNavbar />
    </div>
  )
}
