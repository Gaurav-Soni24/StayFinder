import axios from "./axios"
import { getAuthHeader } from "./auth"

const API_BASE = "/api/notifications"

// Helper type for notification
export type Notification = {
  id: string
  type: string
  title: string
  description: string
  read: boolean
  date: string
  image?: string
  createdAt: string
}

export async function getNotifications(): Promise<Notification[]> {
  const res = await axios.get(API_BASE, { headers: getAuthHeader() })
  // Normalize _id to id
  return res.data.map((n: any) => ({ ...n, id: n._id }))
}

export async function markAsRead(notificationId: string): Promise<void> {
  await axios.post(`${API_BASE}/read`, { id: notificationId }, { headers: getAuthHeader() })
}

export async function markAllAsRead(): Promise<void> {
  await axios.post(`${API_BASE}/read`, {}, { headers: getAuthHeader() })
}
