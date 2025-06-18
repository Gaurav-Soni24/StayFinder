"use client"
import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { getNotifications, markAsRead, markAllAsRead, Notification } from "@/lib/notifications"
import { Button } from "@/components/ui/button"

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setLoading(true)
      getNotifications()
        .then(setNotifications)
        .finally(() => setLoading(false))
    }
  }, [open])

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id)
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAll = async () => {
    await markAllAsRead()
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="relative">
      <Button variant="ghost" onClick={() => setOpen((o) => !o)}>
        <Bell />
        {notifications.some(n => !n.read) && (
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-white shadow-lg z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold">Notifications</span>
            <Button variant="link" size="sm" onClick={handleMarkAll}>
              Mark all as read
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No notifications</div>
            ) : notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 ${n.read ? "bg-white" : "bg-blue-50"}`}
              >
                {n.image && (
                  <img src={n.image} alt="" className="w-10 h-10 rounded object-cover" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.description}</div>
                  <div className="text-xs text-muted-foreground">{new Date(n.date).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <Button variant="link" size="sm" onClick={() => handleMarkAsRead(n.id)}>
                    Mark as read
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
