import type { Listing } from "@/types"
import { getListings } from "./listings"

import axios from "./axios"
import { getAuthHeader } from "./auth"

const API_BASE = "/api/favorites"

export async function getFavorites(): Promise<Listing[]> {
  const res = await axios.get(API_BASE, { headers: getAuthHeader() })
  return res.data
}

export async function addToFavorites(listingId: string): Promise<void> {
  await axios.post(API_BASE, { listingId }, { headers: getAuthHeader() })
}

export async function removeFromFavorites(listingId: string): Promise<void> {
  await axios.delete(`${API_BASE}/${listingId}`, { headers: getAuthHeader() })
}
