import axios from "./axios"
import { getAuthHeader } from "./auth"

const API_BASE = "/api/user"


export async function getUserProfile() {
  const res = await axios.get(`${API_BASE}/profile`, {
    headers: getAuthHeader(),
  })
  return res.data
}

export async function updateUserProfile(profile: {
  name?: string,
  phone?: string,
  birthdate?: string,
  avatar?: string,
  location?: string
}) {
  const res = await axios.put(`${API_BASE}/profile`, profile, {
    headers: getAuthHeader(),
  })
  return res.data
}
