"use client"

import { Bell, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: string
  title: string
  description: string
  date: string
  read: boolean
  image?: string
}

interface NotificationListProps {
  notifications: Notification[]
  markAsRead: (id: string) => void
  getNotificationIcon: (type: string) => JSX.Element
}

export default function NotificationList({ notifications, markAsRead, getNotificationIcon }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <div className="mb-3 rounded-full bg-muted p-3">
          <Bell className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-medium">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative flex items-start gap-4 rounded-lg border p-4 transition-all hover:bg-muted/50 ${
            !notification.read ? "bg-primary/5" : ""
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{notification.title}</h3>
              {!notification.read && <span className="h-2 w-2 rounded-full bg-primary"></span>}
            </div>
            <p className="text-sm text-muted-foreground">{notification.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{notification.date}</p>
          </div>
          {!notification.read && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => markAsRead(notification.id)}
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
