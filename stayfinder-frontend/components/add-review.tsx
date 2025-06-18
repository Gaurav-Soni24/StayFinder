"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function AddReview({ listingId, onReview }: { listingId: string, onReview: () => void }) {
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!comment.trim() || comment.length < 5) {
      setError("Comment must be at least 5 characters.")
      return
    }
    setLoading(true)
    try {
      try {
        await import("@/lib/reviews").then(({ addReview }) => addReview(listingId, rating, comment));
        toast.success("Review submitted!");
        setComment("");
        setRating(5);
        onReview();
      } catch (e: any) {
        setError(e?.response?.data?.error || e.message || "Failed to submit review");
      }
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-semibold mr-2">Your Rating:</span>
        {[1,2,3,4,5].map((n) => (
          <button
            type="button"
            key={n}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            className="focus:outline-none"
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          >
            <Star className={`w-7 h-7 transition-colors ${((hover ?? rating) >= n) ? 'fill-yellow-400 text-yellow-500' : 'fill-muted text-muted-foreground'}`} />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{rating} / 5</span>
      </div>
      <div>
        <textarea
          className="w-full rounded-md border px-3 py-2 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 transition min-h-[80px]"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your experience..."
          required
          minLength={5}
          maxLength={500}
        />
        <div className="text-xs text-muted-foreground mt-1">Min 5, max 500 characters.</div>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <Button
        type="submit"
        disabled={loading || !comment.trim() || comment.length < 5}
        className="w-full mt-2"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
