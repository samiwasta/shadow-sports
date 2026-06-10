"use client"

import { createContext, useContext, useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

type TextOpacityEnum = "none" | "soft" | "medium"
type ViewTypeEnum = "word" | "letter"

type TextGradientScrollType = {
  text: string
  type?: ViewTypeEnum
  className?: string
  textOpacity?: TextOpacityEnum
  progress?: MotionValue<number>
}

type LetterType = {
  children: React.ReactNode | string
  progress: MotionValue<number>
  range: number[]
}

type WordType = {
  children: React.ReactNode
  progress: MotionValue<number>
  range: number[]
}

type CharType = {
  children: React.ReactNode
  progress: MotionValue<number>
  range: number[]
}

type TextGradientScrollContextType = {
  textOpacity?: TextOpacityEnum
  type?: ViewTypeEnum
}

const TextGradientScrollContext = createContext<TextGradientScrollContextType>(
  {},
)

function useGradientScroll() {
  return useContext(TextGradientScrollContext)
}

function TextGradientScroll({
  text,
  className,
  type = "letter",
  textOpacity = "soft",
  progress,
}: TextGradientScrollType) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress: internalProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  })
  const scrollYProgress = progress ?? internalProgress

  const words = text.split(" ")

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity, type }}>
      <p ref={ref} className={cn("relative m-0 flex flex-wrap", className)}>
        {words.map((word, i) => {
          const start = i / words.length
          const end = start + 1 / words.length
          return type === "word" ? (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          ) : (
            <Letter key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Letter>
          )
        })}
      </p>
    </TextGradientScrollContext.Provider>
  )
}

export { TextGradientScroll }

function useRevealOpacity(progress: MotionValue<number>, range: number[]) {
  const [start = 0, end = 1] = range

  return useTransform(progress, (latest) => {
    if (latest <= start) return 0
    if (latest >= end) return 1
    return (latest - start) / (end - start)
  })
}

function Word({ children, progress, range }: WordType) {
  const opacity = useRevealOpacity(progress, range)

  return (
    <span className="relative me-2 mt-2">
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

function Letter({ children, progress, range }: LetterType) {
  if (typeof children !== "string") {
    return null
  }

  const [rangeStart = 0, rangeEnd = 1] = range
  const amount = rangeEnd - rangeStart
  const step = amount / children.length

  return (
    <span className="relative me-2 mt-2">
      {children.split("").map((char, i) => {
        const start = rangeStart + i * step
        const end = rangeStart + (i + 1) * step
        return (
          <Char key={`c_${i}`} progress={progress} range={[start, end]}>
            {char}
          </Char>
        )
      })}
    </span>
  )
}

function Char({ children, progress, range }: CharType) {
  const opacity = useRevealOpacity(progress, range)
  const { textOpacity } = useGradientScroll()

  return (
    <span>
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity === "none",
          "opacity-10": textOpacity === "soft",
          "opacity-30": textOpacity === "medium",
        })}
      >
        {children}
      </span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}
