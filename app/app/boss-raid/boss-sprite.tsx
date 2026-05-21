'use client'

import { useEffect, useRef, useState } from 'react'
import { BossSpriteSheet } from './bosses'

interface BossSpriteProps {
  idle: BossSpriteSheet
  hit?: BossSpriteSheet
  defeated?: BossSpriteSheet
  hitKey?: number
  isDefeated?: boolean
  size: number
  className?: string
}

type Mode = 'idle' | 'hit' | 'defeated'

export function BossSprite({ idle, hit, defeated, hitKey = 0, isDefeated = false, size, className }: BossSpriteProps) {
  const [mode, setMode] = useState<Mode>('idle')
  const [frame, setFrame] = useState(0)
  const lastHitKeyRef = useRef(hitKey)
  const animFrameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (isDefeated) {
      setMode('defeated')
      setFrame(0)
    }
  }, [isDefeated])

  useEffect(() => {
    if (isDefeated) return
    if (hitKey !== lastHitKeyRef.current && hit) {
      lastHitKeyRef.current = hitKey
      setMode('hit')
      setFrame(0)
    }
  }, [hitKey, hit, isDefeated])

  useEffect(() => {
    const sheet = mode === 'idle' ? idle : mode === 'hit' ? hit : defeated
    if (!sheet) return

    const frameInterval = 1000 / sheet.fps
    let lastFrameTime = performance.now()
    let currentFrame = 0
    setFrame(0)

    const tick = (now: number) => {
      const elapsed = now - lastFrameTime
      if (elapsed >= frameInterval) {
        const framesAdvanced = Math.floor(elapsed / frameInterval)
        lastFrameTime += framesAdvanced * frameInterval
        currentFrame += framesAdvanced
        if (currentFrame >= sheet.frames) {
          if (sheet.loop) {
            currentFrame = currentFrame % sheet.frames
            setFrame(currentFrame)
          } else {
            setFrame(sheet.frames - 1)
            if (mode === 'hit' && !isDefeated) {
              setMode('idle')
            }
            return
          }
        } else {
          setFrame(currentFrame)
        }
      }
      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [mode, idle, hit, defeated, isDefeated])

  const activeSheet = mode === 'idle' ? idle : mode === 'hit' ? (hit ?? idle) : (defeated ?? idle)
  const scale = size / activeSheet.frameSize
  const sheetWidth = activeSheet.frameSize * activeSheet.frames
  const offsetX = -frame * activeSheet.frameSize

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${activeSheet.src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${sheetWidth * scale}px ${activeSheet.frameSize * scale}px`,
        backgroundPosition: `${offsetX * scale}px 0px`,
        imageRendering: 'pixelated',
        filter: mode === 'defeated' ? 'grayscale(0.6)' : undefined,
        transition: 'transform 600ms ease-out, filter 600ms ease-out',
      }}
    />
  )
}
