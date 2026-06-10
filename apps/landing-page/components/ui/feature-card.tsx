"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

import { Card } from "@/components/ui/card"

type FeatureCardProps = {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current
    if (!element) return

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    rotateX.set(((y - centerY) / centerY) * -12)
    rotateY.set(((x - centerX) / centerX) * 12)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className="h-full"
    >
      <Card
        variant="plus"
        className="flex h-full flex-col rounded-lg border-neutral-700 bg-neutral-950 shadow-lg shadow-black/40 transition-shadow duration-300 hover:shadow-xl hover:shadow-blue-500/10 [&>div]:flex [&>div]:h-full [&>div]:flex-col [&>div]:p-5 md:[&>div]:p-6"
      >
        <h3 className="font-heading mb-3 text-2xl font-bold text-foreground uppercase md:text-3xl">
          {title}
        </h3>
        <p className="min-h-[5.5rem] text-lg leading-relaxed text-muted-foreground md:min-h-[6.5rem] md:text-xl">
          {description}
        </p>
      </Card>
    </motion.div>
  )
}
