import { Suspense } from "react"
import { Search } from "lucide-react"

import SearchBar from "@/components/search-bar"
import PropertyGrid from "@/components/property-grid"
import CategoryFilter from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative mx-auto w-full max-w-3xl">
          <SearchBar />
          {/* The search button is now part of the SearchBar form. No need for a separate button here. */}
        </div>
        <CategoryFilter />
      </div>

      <Suspense fallback={<PropertyGridSkeleton />}>
        <PropertyGrid />
      </Suspense>
    </div>
  )
}

function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array(8)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
    </div>
  )
}
