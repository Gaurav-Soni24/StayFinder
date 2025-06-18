import type { Listing } from "@/types"
import axios from "./axios"
import { getAuthHeader } from "./auth"

const API_BASE = "/api/listings"
const REVIEWS_BASE = "/api/reviews"

// API functions
export async function getListings(params?: Record<string, any>): Promise<Listing[]> {
  // Get all listings
  const res = await axios.get(API_BASE, { params });
  return res.data.map(normalizeListing);
}

export async function getListingsByUserId(userId: string): Promise<Listing[]> {
  // Get listings by any user ID
  const res = await axios.get(`${API_BASE}/user/${userId}`);
  return res.data.map(normalizeListing);
}

function normalizeListing(listing: any): Listing {
  return {
    ...listing,
    id: listing._id || listing.id,
    host: listing.host && typeof listing.host === 'object' ? { ...listing.host, id: listing.host._id || listing.host.id } : listing.host,
    reviews: Array.isArray(listing.reviews) ? listing.reviews.map((r: any) => ({ ...r, id: r._id || r.id })) : listing.reviews,
  }
}

export async function getListing(id: string): Promise<Listing> {
  const res = await axios.get(`${API_BASE}/${id}`)
  return normalizeListing(res.data)
}

export async function getUserListings(): Promise<Listing[]> {
  const res = await axios.get(`${API_BASE}/user`, {
    headers: getAuthHeader(),
  })
  return res.data.map(normalizeListing)
}

export async function createListing(listing: Omit<Listing, "id">): Promise<Listing> {
  const res = await axios.post(API_BASE, listing, {
    headers: getAuthHeader(),
  })
  return normalizeListing(res.data)
}

export async function updateListing(id: string, listing: Partial<Listing>): Promise<Listing> {
  const res = await axios.put(`${API_BASE}/${id}`, listing, {
    headers: getAuthHeader(),
  })
  return normalizeListing(res.data)
}

export async function deleteListing(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/${id}`, {
    headers: getAuthHeader(),
  })
}

// Reviews
export async function getReviews(listingId: string) {
  const res = await axios.get(`${REVIEWS_BASE}/${listingId}`)
  return res.data
}

export async function addReview(listingId: string, rating: number, comment: string) {
  const res = await axios.post(
    REVIEWS_BASE,
    { listingId, rating, comment },
    { headers: getAuthHeader() }
  )
  return res.data
}
