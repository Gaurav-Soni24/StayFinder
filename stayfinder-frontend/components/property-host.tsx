import Image from "next/image"
import { Shield, Star } from "lucide-react"

import type { Host } from "@/types"

interface PropertyHostProps {
  host: Host
}

export default function PropertyHost({ host }: PropertyHostProps) {
  return (
    <div className="mt-4 flex items-center gap-4 sm:mt-0">
      <div className="relative h-14 w-14 overflow-hidden rounded-full">
        <Image src={host.avatar || "/placeholder.svg"} alt={host.name} fill className="object-cover" />
      </div>
      <div>
        <div className="flex items-center gap-1">
          {host.isSuperhost && <Shield className="h-4 w-4 text-primary" />}
          <span className="font-medium">{host.name}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Host since {host.joinDate}</span>
          {host.rating && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span>{host.rating}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
