"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, Star } from "lucide-react"

import type { Listing } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface PropertyCardProps {
  listing: Listing
  className?: string
  showWishlistButton?: boolean
  onRemoveFromWishlist?: () => void
}

export default function PropertyCard({
  listing,
  className,
  showWishlistButton = false,
  onRemoveFromWishlist,
}: PropertyCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/listings/${listing.id}`}>
          <Image
            src={listing.images[0] || "/placeholder.svg"}
            alt={listing.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </Link>


      </div>
      <Link href={`/listings/${listing.id}`} className="flex flex-col p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium line-clamp-1">{listing.title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm">{listing.rating}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{listing.location}</p>
        <p className="mt-2 text-sm text-muted-foreground">{listing.availableDates}</p>
        <p className="mt-1">
          <span className="font-medium">${listing.price}</span>{" "}
          <span className="text-sm text-muted-foreground">night</span>
        </p>
      </Link>
    </div>
  )
}
