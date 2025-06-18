"use client"

import { useEffect, useState } from "react"

import { getListing } from "@/lib/listings"
import type { Listing } from "@/types"

export function useProperty(id: string) {
  const [property, setProperty] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProperty() {
      try {
        setIsLoading(true)
        const data = await getListing(id)
        setProperty(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch property"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  return {
    property: property as Listing,
    isLoading,
    error,
  }
}
