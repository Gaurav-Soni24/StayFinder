import axios from "./axios"
import { getAuthHeader } from "./auth"

export async function bookListing({ listingId, dates, guests }: { listingId: string, dates: string, guests: number }) {
  const res = await axios.post("/api/user/bookings", { listingId, dates, guests }, {
    headers: getAuthHeader(),
  })
  return res.data
}
