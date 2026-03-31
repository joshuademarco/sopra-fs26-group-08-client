"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface CharacterStatProperties {
    label: string
    value: number
    maxValue: number
    color: string
    height: number
}


export function CharacterStats({ label, value, maxValue, color, height="h-2" }: CharacterStatProperties) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))

  return (
    <Card className="flex flex-col justify-center gap-3 w-full p-6 bg-muted/20 border-border">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className="font-bold">{value} / {maxValue}</span>
      </div>
      
      <Progress value={percentage} className={`w-full ${height}`} innerClassName={color} />
    </Card>
  )
}

