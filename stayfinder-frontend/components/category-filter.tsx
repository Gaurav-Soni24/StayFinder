"use client"

import { useState } from "react"
import {
  BeanIcon as Beach,
  Castle,
  Home,
  Mountain,
  Ship,
  Snowflake,
  Tent,
  Trees,
  Warehouse,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  {
    label: "All",
    icon: Home,
    value: "all",
  },
  {
    label: "Beach",
    icon: Beach,
    value: "beach",
  },
  {
    label: "Cabin",
    icon: Warehouse,
    value: "cabin",
  },
  {
    label: "Countryside",
    icon: Trees,
    value: "countryside",
  },
  {
    label: "Tropical",
    icon: Trees,
    value: "tropical",
  },
  {
    label: "Mountain",
    icon: Mountain,
    value: "mountain",
  },
  {
    label: "Camping",
    icon: Tent,
    value: "camping",
  },
  {
    label: "Castle",
    icon: Castle,
    value: "castle",
  },
  {
    label: "Skiing",
    icon: Snowflake,
    value: "skiing",
  },
  {
    label: "Houseboat",
    icon: Ship,
    value: "houseboat",
  },
]

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-3">
      <div className="flex w-max gap-2 px-1">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant="ghost"
            size="sm"
            onClick={() => setActiveCategory(category.value)}
            className={cn(
              "flex items-center gap-2 rounded-full border",
              activeCategory === category.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-transparent hover:border-border hover:bg-transparent",
            )}
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" className="invisible" />
    </ScrollArea>
  )
}
