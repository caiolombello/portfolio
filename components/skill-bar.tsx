"use client"

import { useEffect, useRef, useState } from "react"

interface SkillBarProps {
  skillName: string
  percentage: number
}

export default function SkillBar({ skillName, percentage }: SkillBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (barRef.current) {
      observer.observe(barRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="mb-4" ref={barRef}>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{skillName}</span>
        <span className="text-sm font-medium text-gold">{percentage}%</span>
      </div>
      <div className="w-full bg-secondary rounded-full h-2.5">
        <div
          className="bg-gold h-2.5 rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: isVisible ? `${percentage}%` : "0%" }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  )
}

