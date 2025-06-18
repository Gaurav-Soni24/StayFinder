import type React from "react"
import {
  Bath,
  Bed,
  Coffee,
  Dumbbell,
  Flame,
  ParkingMeterIcon as Parking,
  PocketIcon as Pool,
  Tv,
  Wifi,
} from "lucide-react"

import { cn } from "@/lib/utils"

interface PropertyFeaturesProps {
  features: string[]
  className?: string
}

const featureIcons: Record<string, React.ElementType> = {
  Wifi: Wifi,
  TV: Tv,
  Kitchen: Coffee,
  Pool: Pool,
  "Hot tub": Flame,
  "Free parking": Parking,
  Gym: Dumbbell,
  "King bed": Bed,
  "Private bathroom": Bath,
}

export default function PropertyFeatures({ features, className }: PropertyFeaturesProps) {
  return (
    <div className={cn("border-b pb-6", className)}>
      <h2 className="mb-4 text-xl font-medium">What this place offers</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = featureIcons[feature] || Wifi

          return (
            <div key={feature} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-muted-foreground" />
              <span>{feature}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
