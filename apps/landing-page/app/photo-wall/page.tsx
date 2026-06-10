import type { Metadata } from "next"

import PhotoWallCanvas from "@/components/ui/photo-wall-canvas"
import { SiteNavbar } from "@/components/site-navbar"
import { createPageMetadata } from "@/lib/site-metadata"

export const metadata: Metadata = createPageMetadata({
  title: "Photo Wall",
  description:
    "Explore Shadow Sports memories on an infinite photo wall — trophy nights, net sessions, match day, and club moments from Ratnagiri.",
  path: "/photo-wall",
})

export default function PhotoWallPage() {
  return (
    <div className="relative h-svh w-full overflow-hidden bg-black">
      <PhotoWallCanvas />
      <SiteNavbar />
    </div>
  )
}
