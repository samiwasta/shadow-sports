"use client"

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  type AnimationSequence,
  motion,
  type Target,
  type Transition,
  useAnimate,
  useAnimationFrame,
} from "motion/react"

import { useMouseVector } from "@/components/hooks/use-mouse-vector"

type TrailSegment = [Target, Transition]
type TrailAnimationSequence = TrailSegment[]

interface ImageTrailProps {
  children: React.ReactNode
  containerRef?: React.RefObject<HTMLElement | null>
  newOnTop?: boolean
  rotationRange?: number
  animationSequence?: TrailAnimationSequence
  interval?: number
}

interface TrailItemData {
  id: string
  x: number
  y: number
  rotation: number
  animationSequence: TrailAnimationSequence
  child: React.ReactNode
}

function createTrailId() {
  return crypto.randomUUID()
}

function ImageTrail({
  children,
  newOnTop = true,
  rotationRange = 15,
  containerRef,
  animationSequence = [
    [{ scale: 1.2 }, { duration: 0.1, ease: "circOut" }],
    [{ scale: 0 }, { duration: 0.5, ease: "circIn" }],
  ],
  interval = 100,
}: ImageTrailProps) {
  const [trailItems, setTrailItems] = useState<TrailItemData[]>([])
  const lastAddedTimeRef = useRef(0)
  const { position: mousePosition } = useMouseVector(containerRef)
  const lastMousePosRef = useRef(mousePosition)
  const currentIndexRef = useRef(0)

  const childrenArray = useMemo(() => Children.toArray(children), [children])

  const addToTrail = useCallback(
    (mousePos: { x: number; y: number }) => {
      const child = childrenArray[currentIndexRef.current]
      if (!child) return

      const newItem: TrailItemData = {
        id: createTrailId(),
        x: mousePos.x,
        y: mousePos.y,
        rotation: (Math.random() - 0.5) * rotationRange * 2,
        animationSequence,
        child,
      }

      currentIndexRef.current =
        (currentIndexRef.current + 1) % childrenArray.length

      setTrailItems((current) =>
        newOnTop ? [...current, newItem] : [newItem, ...current],
      )
    },
    [childrenArray, rotationRange, animationSequence, newOnTop],
  )

  const removeFromTrail = useCallback((itemId: string) => {
    setTrailItems((current) => current.filter((item) => item.id !== itemId))
  }, [])

  useAnimationFrame((time) => {
    if (
      lastMousePosRef.current.x === mousePosition.x &&
      lastMousePosRef.current.y === mousePosition.y
    ) {
      return
    }

    lastMousePosRef.current = mousePosition

    let clientX = mousePosition.x
    let clientY = mousePosition.y

    if (containerRef?.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      clientX = containerRect.left + mousePosition.x
      clientY = containerRect.top + mousePosition.y
    }

    const navbar = document.getElementById("site-navbar")
    if (navbar) {
      const navRect = navbar.getBoundingClientRect()
      if (
        clientY >= navRect.top &&
        clientY <= navRect.bottom &&
        clientX >= navRect.left &&
        clientX <= navRect.right
      ) {
        return
      }
    }

    if (containerRef?.current) {
      const rect = containerRef.current.getBoundingClientRect()
      if (
        mousePosition.x < 0 ||
        mousePosition.y < 0 ||
        mousePosition.x > rect.width ||
        mousePosition.y > rect.height
      ) {
        return
      }
    }

    if (time - lastAddedTimeRef.current < interval) return

    lastAddedTimeRef.current = time
    addToTrail(mousePosition)
  })

  return (
    <div className="pointer-events-none relative h-full w-full">
      {trailItems.map((item) => (
        <TrailItem key={item.id} item={item} onComplete={removeFromTrail} />
      ))}
    </div>
  )
}

interface TrailItemProps {
  item: TrailItemData
  onComplete: (id: string) => void
}

function TrailItem({ item, onComplete }: TrailItemProps) {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    if (!scope.current) return

    const sequence = item.animationSequence.map((segment) => [
      scope.current,
      ...segment,
    ])

    void animate(sequence as AnimationSequence).then(() => {
      onComplete(item.id)
    })
  }, [animate, item.animationSequence, item.id, onComplete, scope])

  return (
    <motion.div
      ref={scope}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: item.x,
        top: item.y,
        rotate: item.rotation,
      }}
    >
      {item.child}
    </motion.div>
  )
}

export { ImageTrail }
