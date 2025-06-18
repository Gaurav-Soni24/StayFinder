"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Clock, MessageSquare, Star } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getNotifications } from "@/lib/notifications"
import NotificationList from "./NotificationList"

interface Notification {
  id: string
  type: "message" | "booking" | "review" | "system"
  title: string
  description: string
  date: string
  read: boolean
  image?: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
      } catch (error) {
        toast.error("Failed to load notifications")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [router])

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    toast.success("Marked as read")
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
    toast.success("All notifications marked as read")
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case "booking":
        return <Clock className="h-5 w-5 text-green-500" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-1/4 rounded-md bg-muted"></div>
          <div className="h-6 w-1/3 rounded-md bg-muted"></div>
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-20 rounded-lg bg-muted"></div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your account activity</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All
            {notifications.length > 0 && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{notifications.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            {unreadCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <NotificationList
            notifications={notifications}
            markAsRead={markAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>

        <TabsContent value="unread">
          <NotificationList
            notifications={notifications.filter((notification) => !notification.read)}
            markAsRead={markAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>

        <TabsContent value="messages">
          <NotificationList
            notifications={notifications.filter((notification) => notification.type === "message")}
            markAsRead={markAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>

        <TabsContent value="bookings">
          <NotificationList
            notifications={notifications.filter((notification) => notification.type === "booking")}
            markAsRead={markAsRead}
            getNotificationIcon={getNotificationIcon}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
