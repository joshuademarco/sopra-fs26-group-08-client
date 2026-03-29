"use client"

import * as React from "react"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

interface CharacterStatProperties {
    label: string
    value: number
    maxValue: number
    color: string
}


export function CharacterStats({ label, value, maxValue }: CharacterStatProperties) {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))

  return (
    <Card className="flex flex-col gap-3 w-full max-w-md">
    <div>
    <p> Strength </p>
     <Progress value={percentage} className="w-[100%]" innerClassName="bg-rose-500"/>
    </div>
    <div>
    <p> Intelligence </p>
     <Progress value={percentage} className="w-[100%]" innerClassName="bg-sky-500"/>
    </div>
    <div>
    <p> Resilience </p>
     <Progress value={percentage} className="w-[100%]" innerClassName="bg-emerald-500"/>
    </div>
    </Card>
  )
}

