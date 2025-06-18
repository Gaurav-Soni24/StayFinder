"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import PropertyCard from "@/components/property-card"
import { getWishlist } from "@/lib/wishlist";
import type { Listing } from "@/types"

export default function PropertiesPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [wishlist, setWishlist] = useState<Listing[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    
    const fetchData = async () => {
      try {
        const data = await getWishlist()
        setWishlist(data?.wishlist || data)
      } catch (error) {
        toast.error("Failed to load wishlist")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [router])



  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-1/4 rounded-md bg-muted"></div>
          <div className="h-40 w-full rounded-md bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Saved Properties</h1>
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h3 className="mb-2 text-xl font-medium">No saved properties</h3>
          <p className="mb-6 text-muted-foreground">You haven't saved any properties yet.</p>
          <Button onClick={() => router.push("/")}>Explore Properties</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((listing: Listing) => (
            <PropertyCard
              key={listing.id}
              listing={listing}
            />
          ))}
        </div>
      )}
    </div>
  )
}