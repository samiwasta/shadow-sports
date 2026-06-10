"use client"

import { useEffect, useState } from "react"
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavBody,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavItems,
} from "@workspace/ui/components/resizeable-navbar"

const navItems = [
  { name: "Features", link: "#features" },
  { name: "Team", link: "#team" },
  { name: "Photo Wall", link: "#photo-wall" },
  { name: "Contact", link: "#contact" },
]

export function SiteNavbar() {
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-16 w-full"
      />
    )
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-auto">
        <Navbar className="bg-transparent">
      <NavBody className="bg-transparent shadow-none dark:bg-transparent">
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="relative z-20 flex items-center gap-2">
          <NavbarButton variant="secondary">Login</NavbarButton>
          <NavbarButton variant="primary">Join the Club</NavbarButton>
        </div>
      </NavBody>

      <MobileNav className="bg-transparent dark:bg-transparent">
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              className="font-heading w-full rounded-md px-4 py-2 text-sm font-semibold tracking-wide text-neutral-600 uppercase dark:text-neutral-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <div className="mt-4 flex w-full flex-col gap-2">
            <NavbarButton
              variant="secondary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavbarButton>
            <NavbarButton
              variant="primary"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join the Club
            </NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
        </Navbar>
      </div>
    </div>
  )
}
