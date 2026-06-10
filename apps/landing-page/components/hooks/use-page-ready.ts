"use client"

import { useEffect, useState } from "react"

import { TEAM_PHOTOS } from "@/lib/team-photos"

const MIN_LOADER_MS = 1400
const STATUS_MESSAGES = [
  "Warming up the nets",
  "Rolling the pitch",
  "Gathering the XI",
  "Preparing match day",
] as const

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new window.Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = src
  })
}

function waitForWindowLoad() {
  if (document.readyState === "complete") return Promise.resolve()

  return new Promise<void>((resolve) => {
    window.addEventListener("load", () => resolve(), { once: true })
  })
}

function waitForAnimationFrame() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

function waitForMinimumTime(startedAt: number) {
  const elapsed = Date.now() - startedAt
  const remaining = Math.max(0, MIN_LOADER_MS - elapsed)

  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, remaining)
  })
}

async function loadGsap() {
  await import("gsap")
  await import("gsap/ScrollTrigger")
}

export function usePageReady() {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [statusIndex, setStatusIndex] = useState(0)

  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()

    async function preparePage() {
      setProgress(8)

      await document.fonts.ready
      if (cancelled) return
      setProgress(22)

      const images = TEAM_PHOTOS.map((photo) => photo.src)
      let loadedImages = 0

      await Promise.all(
        images.map(async (src) => {
          await preloadImage(src)
          loadedImages += 1
          if (!cancelled) {
            setProgress(22 + Math.round((loadedImages / images.length) * 48))
          }
        }),
      )

      if (cancelled) return

      await Promise.all([waitForWindowLoad(), loadGsap()])
      if (cancelled) return
      setProgress(84)

      await waitForAnimationFrame()
      if (cancelled) return
      setProgress(94)

      await waitForMinimumTime(startedAt)
      if (cancelled) return

      setProgress(100)
      setIsReady(true)
    }

    void preparePage()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isReady) return

    const interval = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length)
    }, 900)

    return () => window.clearInterval(interval)
  }, [isReady])

  useEffect(() => {
    document.body.style.overflow = isReady ? "" : "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [isReady])

  return {
    isReady,
    progress,
    status: STATUS_MESSAGES[statusIndex],
  }
}
