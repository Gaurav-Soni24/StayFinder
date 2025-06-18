import axios from "./axios"
import { getAuthHeader } from "./auth"

export async function addToWishlist(listingId: string) {
  await axios.post("/api/user/wishlist", { listingId }, { headers: getAuthHeader() })
}

export async function removeFromWishlist(listingId: string) {
  await axios.delete(`/api/user/wishlist/${listingId}`, { headers: getAuthHeader() })
}

export async function getWishlist() {
  const res = await axios.get("/api/user/wishlist", { headers: getAuthHeader() })
  return res.data
}
