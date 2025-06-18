import axios from "./axios"
import { getAuthHeader } from "./auth"

export async function addReview(listingId: string, rating: number, comment: string) {
  const res = await axios.post("/api/reviews", { listingId, rating, comment }, { headers: getAuthHeader() })
  return res.data
}

export async function getReviews(listingId: string) {
  const res = await axios.get(`/api/reviews?listingId=${listingId}`)
  return res.data
}
