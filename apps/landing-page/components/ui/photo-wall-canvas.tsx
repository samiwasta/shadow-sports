"use client"

import Image from "next/image"
import { Hand } from "lucide-react"
import { useAnimationFrame } from "motion/react"
import { useCallback, useEffect, useRef, useState } from "react"

import { TEAM_PHOTOS } from "@/lib/team-photos"
import { cn } from "@workspace/ui/lib/utils"

type PhotoPlacement = {
  id: string
  src: string
  alt: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

type Camera = {
  x: number
  y: number
  scale: number
}

type GridBounds = {
  left: number
  top: number
  width: number
  height: number
}

const CHUNK_SIZE = 920
const CHUNK_BLEED = 120
const MIN_GAP = 18
const BUFFER_CHUNKS = 1
const PRUNE_DISTANCE = 4
const PLACEMENT_SEED = 0x53484148
const WORLD_CENTER_X = CHUNK_SIZE / 2
const WORLD_CENTER_Y = CHUNK_SIZE / 2
const INITIAL_SCALE = 0.74
const STARTER_RADIUS = 1
const MIN_SCALE = 0.55
const MAX_SCALE = 2.2
const ZOOM_EASE = 0.14
const PAN_EASE = 0.22
const GRID_MINOR = 64
const GRID_MAJOR = 320

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashChunk(cx: number, cy: number) {
  return ((cx * 73856093) ^ (cy * 19349663) ^ PLACEMENT_SEED) >>> 0
}

function chunkKey(cx: number, cy: number) {
  return `${cx},${cy}`
}

function overlaps(
  a: Pick<PhotoPlacement, "x" | "y" | "width" | "height">,
  b: Pick<PhotoPlacement, "x" | "y" | "width" | "height">,
  gap: number,
) {
  return !(
    a.x + a.width + gap <= b.x ||
    b.x + b.width + gap <= a.x ||
    a.y + a.height + gap <= b.y ||
    b.y + b.height + gap <= a.y
  )
}

function getCollisionBounds(item: PhotoPlacement) {
  const rad = (item.rotation * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))
  const width = item.width * cos + item.height * sin
  const height = item.width * sin + item.height * cos
  const centerX = item.x + item.width / 2
  const centerY = item.y + item.height / 2

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  }
}

function getRotatedAabbSize(width: number, height: number, rotation: number) {
  const rad = (rotation * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))

  return {
    width: width * cos + height * sin,
    height: width * sin + height * cos,
  }
}

function pickPhotoSize(random: () => number, chunkDistance: number) {
  const roll = random()
  const largeBoost = chunkDistance <= 1 ? 0.08 : 0

  if (roll < 0.22 - largeBoost) {
    const width = 255 + random() * 90
    return { width, height: width * (0.72 + random() * 0.18) }
  }

  if (roll < 0.68) {
    const width = 345 + random() * 120
    return { width, height: width * (0.66 + random() * 0.2) }
  }

  const width = 465 + random() * 140
  return { width, height: width * (0.62 + random() * 0.18) }
}

function pickFallbackPhotoSize(random: () => number, tier: number) {
  if (tier === 0) {
    const width = 295 + random() * 75
    return { width, height: width * (0.7 + random() * 0.16) }
  }

  const width = 240 + random() * 70
  return { width, height: width * (0.72 + random() * 0.14) }
}

function getChunkDistance(cx: number, cy: number) {
  return Math.max(Math.abs(cx), Math.abs(cy))
}

function getChunkRegion(cx: number, cy: number) {
  const random = mulberry32(hashChunk(cx, cy) ^ 0x9e3779b9)
  const chunkDistance = getChunkDistance(cx, cy)
  const chunkCenterX = cx * CHUNK_SIZE + CHUNK_SIZE / 2
  const chunkCenterY = cy * CHUNK_SIZE + CHUNK_SIZE / 2
  const staggerScale = chunkDistance === 0 ? 0 : chunkDistance === 1 ? 0.45 : 1
  const columnStagger = (((cx * 173 + cy * 97) % 5) * 56 - 112) * staggerScale
  const rowStagger = (((cy * 131 + cx * 61) % 5) * 52 - 104) * staggerScale
  const spread = CHUNK_SIZE + CHUNK_BLEED * (chunkDistance === 0 ? 0.85 : 1.2)

  return {
    x:
      chunkCenterX -
      spread / 2 +
      columnStagger +
      (random() - 0.5) * CHUNK_BLEED * 0.5,
    y:
      chunkCenterY -
      spread / 2 +
      rowStagger +
      (random() - 0.5) * CHUNK_BLEED * 0.5,
    width: spread,
    height: spread,
  }
}

function pickPointInRegion(
  region: { x: number; y: number; width: number; height: number },
  aabb: { width: number; height: number },
  random: () => number,
  centerBias: number,
) {
  const maxX = region.width - aabb.width
  const maxY = region.height - aabb.height
  if (maxX <= 0 || maxY <= 0) return null

  let tX = random()
  let tY = random()

  if (centerBias > 0) {
    tX = 0.5 + (tX - 0.5) * (1 - centerBias)
    tY = 0.5 + (tY - 0.5) * (1 - centerBias)
  }

  return {
    aabbX: region.x + tX * maxX,
    aabbY: region.y + tY * maxY,
  }
}

function generateChunkPlacements(
  cx: number,
  cy: number,
  existing: PhotoPlacement[],
): PhotoPlacement[] {
  const random = mulberry32(hashChunk(cx, cy))
  const region = getChunkRegion(cx, cy)
  const chunkDistance = getChunkDistance(cx, cy)
  const photoCount =
    chunkDistance === 0
      ? 14 + Math.floor(random() * 4)
      : chunkDistance === 1
        ? 11 + Math.floor(random() * 3)
        : 7 + Math.floor(random() * 3)
  const centerBias =
    chunkDistance === 0 ? 0.18 : chunkDistance === 1 ? 0.12 : 0.08
  const placed: PhotoPlacement[] = []

  for (let i = 0; i < photoCount; i++) {
    const photo = TEAM_PHOTOS[Math.floor(random() * TEAM_PHOTOS.length)]
    if (!photo) continue

    let added = false

    for (let tier = 0; tier < 3 && !added; tier++) {
      for (let attempt = 0; attempt < 56; attempt++) {
        const { width, height } =
          tier === 0
            ? pickPhotoSize(random, chunkDistance)
            : pickFallbackPhotoSize(random, tier - 1)
        const rotation = -12 + random() * 24
        const aabb = getRotatedAabbSize(width, height, rotation)
        const point = pickPointInRegion(region, aabb, random, centerBias)
        if (!point) continue

        const centerX = point.aabbX + aabb.width / 2
        const centerY = point.aabbY + aabb.height / 2

        const candidate: PhotoPlacement = {
          id: `${cx}:${cy}:${i}`,
          src: photo.src,
          alt: photo.alt,
          x: centerX - width / 2,
          y: centerY - height / 2,
          width,
          height,
          rotation,
        }

        const hasOverlap = [...placed, ...existing].some((item) =>
          overlaps(
            getCollisionBounds(candidate),
            getCollisionBounds(item),
            MIN_GAP,
          ),
        )

        if (!hasOverlap) {
          placed.push(candidate)
          added = true
          break
        }
      }
    }
  }

  return placed
}

function getNeighborPlacements(
  cx: number,
  cy: number,
  placementsByChunk: Map<string, PhotoPlacement[]>,
) {
  const neighborPlacements: PhotoPlacement[] = []

  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (dx === 0 && dy === 0) continue
      const neighbor = placementsByChunk.get(chunkKey(cx + dx, cy + dy))
      if (neighbor) neighborPlacements.push(...neighbor)
    }
  }

  return neighborPlacements
}

function bootstrapStarterChunks(
  placementsByChunk: Map<string, PhotoPlacement[]>,
  generated: Set<string>,
) {
  const starterChunks = []

  for (let cx = -STARTER_RADIUS; cx <= STARTER_RADIUS; cx++) {
    for (let cy = -STARTER_RADIUS; cy <= STARTER_RADIUS; cy++) {
      starterChunks.push([cx, cy] as const)
    }
  }

  starterChunks.sort(
    (a, b) => getChunkDistance(a[0], a[1]) - getChunkDistance(b[0], b[1]),
  )

  for (const [cx, cy] of starterChunks) {
    const key = chunkKey(cx, cy)
    if (generated.has(key)) continue

    generated.add(key)
    placementsByChunk.set(
      key,
      generateChunkPlacements(cx, cy, getNeighborPlacements(cx, cy, placementsByChunk)),
    )
  }
}

function getVisibleChunkRange(
  camera: Camera,
  viewportWidth: number,
  viewportHeight: number,
) {
  const left = -camera.x / camera.scale
  const top = -camera.y / camera.scale
  const right = (viewportWidth - camera.x) / camera.scale
  const bottom = (viewportHeight - camera.y) / camera.scale

  return {
    minCx: Math.floor(left / CHUNK_SIZE) - BUFFER_CHUNKS,
    maxCx: Math.floor(right / CHUNK_SIZE) + BUFFER_CHUNKS,
    minCy: Math.floor(top / CHUNK_SIZE) - BUFFER_CHUNKS,
    maxCy: Math.floor(bottom / CHUNK_SIZE) + BUFFER_CHUNKS,
  }
}

function getGridBounds(range: ReturnType<typeof getVisibleChunkRange>): GridBounds {
  return {
    left: range.minCx * CHUNK_SIZE,
    top: range.minCy * CHUNK_SIZE,
    width: (range.maxCx - range.minCx + 1) * CHUNK_SIZE,
    height: (range.maxCy - range.minCy + 1) * CHUNK_SIZE,
  }
}

function flattenPlacements(
  placementsByChunk: Map<string, PhotoPlacement[]>,
) {
  return Array.from(placementsByChunk.values()).flat()
}

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

function zoomAtPoint(
  camera: Camera,
  pointerX: number,
  pointerY: number,
  nextScale: number,
) {
  const ratio = nextScale / camera.scale
  return {
    x: pointerX - (pointerX - camera.x) * ratio,
    y: pointerY - (pointerY - camera.y) * ratio,
    scale: nextScale,
  }
}

export default function PhotoWallCanvas() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<Camera>({ x: 0, y: 0, scale: 1 })
  const targetRef = useRef<Camera>({ x: 0, y: 0, scale: 1 })
  const isDraggingRef = useRef(false)
  const dragRef = useRef({ pointerX: 0, pointerY: 0, originX: 0, originY: 0 })
  const generatedChunksRef = useRef(new Set<string>())
  const placementsByChunkRef = useRef(new Map<string, PhotoPlacement[]>())
  const lastRangeRef = useRef("")

  const [isDragging, setIsDragging] = useState(false)
  const [placements, setPlacements] = useState<PhotoPlacement[]>([])
  const [gridBounds, setGridBounds] = useState<GridBounds>({
    left: -CHUNK_SIZE,
    top: -CHUNK_SIZE,
    width: CHUNK_SIZE * 3,
    height: CHUNK_SIZE * 3,
  })

  const applyTransform = useCallback((camera: Camera) => {
    const world = worldRef.current
    if (!world) return
    world.style.transform = `translate3d(${camera.x}px, ${camera.y}px, 0) scale(${camera.scale})`
  }, [])

  const syncWorld = useCallback((camera: Camera) => {
    const viewport = viewportRef.current
    if (!viewport) return

    const range = getVisibleChunkRange(
      camera,
      viewport.clientWidth,
      viewport.clientHeight,
    )
    const generated = generatedChunksRef.current
    const placementsByChunk = placementsByChunkRef.current
    let changed = false

    for (let cx = range.minCx; cx <= range.maxCx; cx++) {
      for (let cy = range.minCy; cy <= range.maxCy; cy++) {
        const key = chunkKey(cx, cy)
        if (generated.has(key)) continue

        generated.add(key)
        placementsByChunk.set(
          key,
          generateChunkPlacements(
            cx,
            cy,
            getNeighborPlacements(cx, cy, placementsByChunk),
          ),
        )
        changed = true
      }
    }

    const centerCx = Math.floor(
      (-camera.x / camera.scale + viewport.clientWidth / camera.scale / 2) /
        CHUNK_SIZE,
    )
    const centerCy = Math.floor(
      (-camera.y / camera.scale + viewport.clientHeight / camera.scale / 2) /
        CHUNK_SIZE,
    )

    for (const key of [...generated]) {
      const [cx, cy] = key.split(",").map(Number)
      if (cx === undefined || cy === undefined) continue

      if (
        Math.abs(cx - centerCx) > PRUNE_DISTANCE ||
        Math.abs(cy - centerCy) > PRUNE_DISTANCE
      ) {
        generated.delete(key)
        placementsByChunk.delete(key)
        changed = true
      }
    }

    const rangeKey = `${range.minCx},${range.maxCx},${range.minCy},${range.maxCy}`
    if (rangeKey !== lastRangeRef.current) {
      lastRangeRef.current = rangeKey
      setGridBounds(getGridBounds(range))
    }

    if (changed) {
      setPlacements(flattenPlacements(placementsByChunk))
    }
  }, [])

  const centerCamera = useCallback(
    (scale = INITIAL_SCALE) => {
      const viewport = viewportRef.current
      if (!viewport) return

      bootstrapStarterChunks(
        placementsByChunkRef.current,
        generatedChunksRef.current,
      )
      setPlacements(flattenPlacements(placementsByChunkRef.current))
      setGridBounds(
        getGridBounds({
          minCx: -STARTER_RADIUS,
          maxCx: STARTER_RADIUS,
          minCy: -STARTER_RADIUS,
          maxCy: STARTER_RADIUS,
        }),
      )

      const next = {
        x: viewport.clientWidth / 2 - (WORLD_CENTER_X + 36) * scale,
        y: viewport.clientHeight / 2 - (WORLD_CENTER_Y + 24) * scale,
        scale,
      }

      cameraRef.current = next
      targetRef.current = next
      applyTransform(next)
      syncWorld(next)
    },
    [applyTransform, syncWorld],
  )

  useEffect(() => {
    centerCamera()

    function handleResize() {
      const viewport = viewportRef.current
      if (!viewport) return

      const scale = targetRef.current.scale
      const next = {
        ...targetRef.current,
        x: viewport.clientWidth / 2 - (WORLD_CENTER_X + 36) * scale,
        y: viewport.clientHeight / 2 - (WORLD_CENTER_Y + 24) * scale,
      }

      targetRef.current = next
      cameraRef.current = next
      applyTransform(next)
      syncWorld(next)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [centerCamera, syncWorld, applyTransform])

  useAnimationFrame(() => {
    const current = cameraRef.current
    const target = targetRef.current

    if (isDraggingRef.current) {
      applyTransform(current)
      syncWorld(current)
      return
    }

    const next: Camera = {
      x: current.x + (target.x - current.x) * PAN_EASE,
      y: current.y + (target.y - current.y) * PAN_EASE,
      scale: current.scale + (target.scale - current.scale) * ZOOM_EASE,
    }

    const settled =
      Math.abs(next.x - target.x) < 0.4 &&
      Math.abs(next.y - target.y) < 0.4 &&
      Math.abs(next.scale - target.scale) < 0.0008

    cameraRef.current = settled ? target : next
    applyTransform(settled ? target : next)
    syncWorld(settled ? target : next)
  })

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return

    event.currentTarget.setPointerCapture(event.pointerId)
    isDraggingRef.current = true
    setIsDragging(true)
    dragRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      originX: targetRef.current.x,
      originY: targetRef.current.y,
    }
    cameraRef.current = { ...targetRef.current }
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return

    const next = {
      ...targetRef.current,
      x: dragRef.current.originX + event.clientX - dragRef.current.pointerX,
      y: dragRef.current.originY + event.clientY - dragRef.current.pointerY,
    }

    targetRef.current = next
    cameraRef.current = next
    applyTransform(next)
    syncWorld(next)
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault()

    const viewport = viewportRef.current
    if (!viewport) return

    const rect = viewport.getBoundingClientRect()
    const pointerX = event.clientX - rect.left
    const pointerY = event.clientY - rect.top
    const current = targetRef.current
    const delta = -event.deltaY * 0.0015
    const nextScale = clampScale(current.scale * Math.exp(delta))

    targetRef.current = zoomAtPoint(current, pointerX, pointerY, nextScale)
  }

  return (
    <div
      ref={viewportRef}
      className="relative h-svh w-full touch-none overflow-hidden bg-[#07080c] select-none"
      onWheel={handleWheel}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_60%)]"
        aria-hidden
      />

      <div
        className={cn(
          "absolute inset-0 z-0",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={worldRef}
          className="absolute top-0 left-0 origin-top-left will-change-transform"
        >
          <div
            className="pointer-events-none absolute"
            style={{
              left: gridBounds.left,
              top: gridBounds.top,
              width: gridBounds.width,
              height: gridBounds.height,
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(to right, rgba(59,130,246,0.14) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(59,130,246,0.14) 1px, transparent 1px)
              `,
              backgroundSize: `${GRID_MINOR}px ${GRID_MINOR}px, ${GRID_MINOR}px ${GRID_MINOR}px, ${GRID_MAJOR}px ${GRID_MAJOR}px, ${GRID_MAJOR}px ${GRID_MAJOR}px`,
            }}
            aria-hidden
          />

          {placements.map((item) => (
            <figure
              key={item.id}
              className="absolute overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-[0_20px_48px_rgba(0,0,0,0.45)]"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 400px, 640px"
                className="object-cover"
                draggable={false}
              />
            </figure>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-30 flex justify-center px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs text-zinc-400 backdrop-blur-sm">
          <Hand className="size-3.5 text-blue-400" />
          Drag to explore · Scroll to zoom
        </div>
      </div>
    </div>
  )
}
