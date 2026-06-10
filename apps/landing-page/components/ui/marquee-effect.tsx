"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useAnimationFrame, useMotionValue } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

const DUPLICATES = 4

type MarqueeAnimationProps = {
  children: string
  className?: string
  direction?: "left" | "right"
  baseVelocity: number
}

function MarqueeAnimation({
  children,
  className,
  direction = "left",
  baseVelocity = 50,
}: MarqueeAnimationProps) {
  const baseX = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const [segmentWidth, setSegmentWidth] = useState(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      if (track.scrollWidth > 0) {
        setSegmentWidth(track.scrollWidth / DUPLICATES)
      }
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [children])

  useAnimationFrame((_, delta) => {
    if (segmentWidth === 0) return

    const pixelsPerSecond = Math.abs(baseVelocity) * 40
    const directionMultiplier = direction === "left" ? -1 : 1
    let nextX = baseX.get() + directionMultiplier * pixelsPerSecond * (delta / 1000)

    while (nextX <= -segmentWidth) nextX += segmentWidth
    while (nextX > 0) nextX -= segmentWidth

    baseX.set(nextX)
  })

  return (
    <div className="relative max-w-[100vw] overflow-hidden">
      <motion.div
        ref={trackRef}
        className={cn(
          "flex w-max flex-nowrap will-change-transform",
          className,
        )}
        style={{ x: baseX }}
      >
        {Array.from({ length: DUPLICATES }, (_, index) => (
          <span
            key={index}
            className="me-10 block shrink-0 whitespace-nowrap"
            aria-hidden={index > 0}
          >
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export { MarqueeAnimation }
