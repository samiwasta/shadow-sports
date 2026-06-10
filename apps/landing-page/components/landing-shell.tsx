"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { usePageReady } from "@/components/hooks/use-page-ready"
import PageLoader from "@/components/ui/page-loader"
import { cn } from "@workspace/ui/lib/utils"

export function LandingShell({ children }: { children: React.ReactNode }) {
  const { isReady, progress, status } = usePageReady()
  const [exiting, setExiting] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    if (!isReady) return

    setExiting(true)
    const timeout = window.setTimeout(() => setShowLoader(false), 680)
    return () => window.clearTimeout(timeout)
  }, [isReady])

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoader ? (
          <PageLoader
            key="page-loader"
            progress={progress}
            status={status}
            exiting={exiting}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        className={cn("relative w-full", !isReady && "pointer-events-none")}
        initial={{ opacity: 0 }}
        animate={{ opacity: isReady ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      >
        {children}
      </motion.div>
    </>
  )
}
