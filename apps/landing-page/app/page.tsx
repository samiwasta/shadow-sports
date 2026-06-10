import type { Metadata } from "next"

import { LandingShell } from "@/components/landing-shell"
import { createPageMetadata, siteConfig } from "@/lib/site-metadata"

export const metadata: Metadata = {
  ...createPageMetadata({
    title: siteConfig.tagline,
    description:
      "Join Shadow Sports for weekly nets, league fixtures, squad updates, and a cricket community in Ratnagiri. Built in the nets, made for match day.",
    path: "/",
  }),
  title: {
    absolute: `${siteConfig.name} | ${siteConfig.tagline}`,
  },
}
import FeaturesSection from "@/components/ui/features-section"
import HeroScrollAnimation from "@/components/ui/hero-scroll-animation"
import JoinClubCta from "@/components/ui/join-club-cta"
import MarqueeSection from "@/components/ui/marquee-section"
import SocialFollowSection from "@/components/ui/social-follow-section"
import TextGradientSection from "@/components/ui/text-gradient-section"
import { CinematicFooter } from "@/components/ui/motion-footer"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <LandingShell>
      <HeroScrollAnimation />
      <TextGradientSection />
      <FeaturesSection />
      <MarqueeSection />
      <JoinClubCta />
      <SocialFollowSection />
      <CinematicFooter />
      <SiteNavbar />
    </LandingShell>
  )
}
