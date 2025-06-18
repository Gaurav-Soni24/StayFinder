"use client"

import { useEffect, useState } from "react"

import { getListings } from "@/lib/listings"
import type { Listing } from "@/types"
import PropertyCard from "@/components/property-card"

import { useSearchParams } from "next/navigation"

export default function PropertyGrid() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Build params from searchParams
        const params: Record<string, string> = {}
        const location = searchParams.get("location")
        const checkIn = searchParams.get("checkIn")
        const checkOut = searchParams.get("checkOut")
        const guests = searchParams.get("guests")
        if (location) params.location = location
        if (checkIn) params.checkIn = checkIn
        if (checkOut) params.checkOut = checkOut
        if (guests) params.guests = guests
        const data = await getListings(params)
        setListings(data)
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
    // Only rerun if searchParams change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing) => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function PropertyCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2">
      <div className="aspect-square w-full rounded-xl bg-muted"></div>
      <div className="h-4 w-2/3 rounded bg-muted"></div>
      <div className="h-4 w-1/2 rounded bg-muted"></div>
      <div className="h-4 w-1/4 rounded bg-muted"></div>
    </div>
  )
}
