"use client"

import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"
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
  { name: "Features", link: "/#features" },
  { name: "Team", link: "/team" },
  { name: "Photo Wall", link: "/photo-wall" },
  { name: "Contact", link: "/contact" },
]

function scrollToSection(link: string) {
  const hash = link.startsWith("/#")
    ? link.slice(1)
    : link.startsWith("#")
      ? link
      : null

  if (!hash) return false

  const target = document.querySelector(hash)
  if (!target) return false

  target.scrollIntoView({ behavior: "smooth", block: "start" })
  return true
}

export function SiteNavbar() {
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [footerInView, setFooterInView] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const footer = document.getElementById("cinematic-footer")
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setFooterInView(entry.isIntersecting && entry.intersectionRatio > 0.2)
      },
      { threshold: [0, 0.2, 0.4, 0.6] },
    )

    observer.observe(footer)
    return () => observer.disconnect()
  }, [mounted])

  useEffect(() => {
    if (footerInView) setIsMobileMenuOpen(false)
  }, [footerInView])

  if (!mounted) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-5 z-50 h-16 w-full"
      />
    )
  }

  return (
    <div
      id="site-navbar"
      className={cn(
        "pointer-events-none fixed inset-x-0 top-5 z-50 transition-all duration-500 ease-out md:top-6",
        footerInView && "-translate-y-6 opacity-0",
      )}
    >
      <div className={cn("pointer-events-auto", footerInView && "pointer-events-none")}>
        <Navbar className="bg-transparent">
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="relative z-20 flex items-center gap-2">
          <NavbarButton variant="secondary" href="/login">
            Login
          </NavbarButton>
          <NavbarButton variant="primary" href="/join">
            Join the Club
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
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
              onClick={(event) => {
                if (scrollToSection(item.link)) {
                  event.preventDefault()
                }
                setIsMobileMenuOpen(false)
              }}
            >
              {item.name}
            </a>
          ))}
          <div className="mt-4 flex w-full flex-col gap-2">
            <NavbarButton
              variant="secondary"
              href="/login"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </NavbarButton>
            <NavbarButton
              variant="primary"
              href="/join"
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
