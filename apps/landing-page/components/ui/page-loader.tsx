"use client"

import { motion } from "motion/react"

import { cn } from "@workspace/ui/lib/utils"

type PageLoaderProps = {
  progress: number
  status: string
  exiting?: boolean
}

export default function PageLoader({
  progress,
  status,
  exiting = false,
}: PageLoaderProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_35%,transparent_100%)]" />

      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 size-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[110px]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-8 flex size-20 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-blue-500/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="absolute inset-2 rounded-full border border-dashed border-blue-400/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            />
            <motion.span
              className="size-4 rounded-full bg-blue-500 shadow-[0_0_24px_rgba(59,130,246,0.85)]"
              animate={{ scale: [1, 1.25, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <p className="font-heading text-xs font-semibold tracking-[0.28em] text-blue-400 uppercase">
            Shadow Sports
          </p>
          <h1 className="font-heading mt-3 text-3xl font-bold tracking-tight text-white uppercase md:text-4xl">
            Built in the nets
          </h1>

          <motion.p
            key={status}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-heading mt-5 text-sm font-semibold tracking-[0.18em] text-zinc-500 uppercase"
          >
            {status}
          </motion.p>
        </motion.div>
      </div>

      <div className="relative px-6 pb-10 md:px-10 md:pb-12">
        <div className="mx-auto w-full max-w-xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-heading text-[10px] font-semibold tracking-[0.24em] text-zinc-500 uppercase">
              Loading club experience
            </span>
            <span className="font-heading text-sm font-bold tracking-wider text-white tabular-nums">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-300",
                "shadow-[0_0_18px_rgba(59,130,246,0.55)]",
              )}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.min(100, progress)}%` }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
