import HeroScrollAnimation from "@/components/ui/hero-scroll-animation"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <div className="relative w-full">
      <HeroScrollAnimation />
      <SiteNavbar />
    </div>
  )
}
