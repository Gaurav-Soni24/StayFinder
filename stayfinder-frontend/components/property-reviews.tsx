import { Star } from "lucide-react"

import type { Review } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface PropertyReviewsProps {
  reviews: Review[]
  rating: number
}

export default function PropertyReviews({ reviews, rating }: PropertyReviewsProps) {
  // Calculate rating distribution
  const ratingCounts = {
    5: reviews.filter((r) => Math.round(r.rating) === 5).length,
    4: reviews.filter((r) => Math.round(r.rating) === 4).length,
    3: reviews.filter((r) => Math.round(r.rating) === 3).length,
    2: reviews.filter((r) => Math.round(r.rating) === 2).length,
    1: reviews.filter((r) => Math.round(r.rating) === 1).length,
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-medium">
          <Star className="h-5 w-5 fill-primary text-primary" />
          {rating} · {reviews.length} reviews
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div className="w-12 text-sm">{num} stars</div>
                <Progress
                  value={(ratingCounts[num as keyof typeof ratingCounts] / reviews.length) * 100}
                  className="h-2"
                />
                <div className="w-8 text-right text-sm text-muted-foreground">
                  {ratingCounts[num as keyof typeof ratingCounts]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
          <div key={review._id || review.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={review.user?.avatar || "/placeholder.svg"} alt={review.user?.name || "User"} />
                <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{review.user?.name || "User"}</div>
                <div className="text-sm text-muted-foreground">{new Date(review.createdAt || review.date).toLocaleDateString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
            </div>
            <div className="text-base">{review.comment}</div>
          </div>
        ))}
      </div>

      {reviews.length > 0 && (
        <div className="mt-6">
          <Button variant="outline">Show all {reviews.length} reviews</Button>
        </div>
      )}
    </div>
  )
}
