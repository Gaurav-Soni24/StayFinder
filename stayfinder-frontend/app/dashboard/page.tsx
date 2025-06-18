"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ListingCard from "@/components/listing-card"
import ListingForm from "@/components/listing-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getUserListings } from "@/lib/listings"
import type { Listing } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [earnings, setEarnings] = useState<number>(0)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    const fetchAll = async () => {
      try {
        const [listingsData, userProfile] = await Promise.all([
          getUserListings(),
          (await import("@/lib/user")).getUserProfile()
        ])
        setListings(listingsData)
        setBookings(userProfile.trips || [])
        // Calculate earnings from completed bookings (for host)
        let totalEarnings = 0
        listingsData.forEach(listing => {
          if (listing && listing.price) {
            // Count bookings for this listing
            const count = (userProfile.trips || []).filter(trip => trip.listingId && (trip.listingId.id === listing.id || trip.listingId === listing.id)).length
            totalEarnings += count * listing.price
          }
        })
        setEarnings(totalEarnings)
      } catch (error) {
        toast.error("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [router])

  const handleAddListing = async (listing: Omit<Listing, "id">) => {
    try {
      const newListing = await (await import("@/lib/listings")).createListing(listing)
      setListings([...listings, newListing])
      setIsDialogOpen(false)
      toast.success("Listing added successfully!")
    } catch (error: any) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Session expired. Please log in again.")
        router.push("/login")
      } else {
        toast.error(error.message || "Failed to add listing.")
      }
    }
  }

  const handleDeleteListing = async (id: string) => {
    try {
      await (await import("@/lib/listings")).deleteListing(id)
      setListings(listings.filter((listing) => listing.id !== id))
      toast.success("Listing deleted successfully!")
    } catch (error: any) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("Session expired. Please log in again.")
        router.push("/login")
      } else {
        toast.error(error.message || "Failed to delete listing.")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-1/4 rounded-md bg-muted"></div>
          <div className="h-6 w-1/3 rounded-md bg-muted"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted"></div>
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
          <h1 className="text-3xl font-bold">Host Dashboard</h1>
          <p className="text-muted-foreground">Manage your properties and bookings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Listing
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Listing</DialogTitle>
            </DialogHeader>
            <ListingForm onSubmit={handleAddListing} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">My Listings</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <h3 className="mb-2 text-xl font-medium">No listings yet</h3>
              <p className="mb-6 text-muted-foreground">Add your first property to start hosting</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Listing
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onDelete={() => handleDeleteListing(listing.id)}
                  isManageable
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings">
          {bookings.length === 0 ? (
            <div className="rounded-lg border p-6 text-center">
              <h3 className="mb-2 text-xl font-medium">No active bookings</h3>
              <p className="text-muted-foreground">Bookings will appear here when you book properties</p>
            </div>
          ) : (
            <div className="rounded-lg border p-6">
              <h3 className="mb-4 text-xl font-medium">Your Bookings</h3>
              <div className="grid grid-cols-1 gap-4">
                {bookings.map((trip, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-semibold">{trip.listingId?.title || "Listing"}</div>
                      <div className="text-muted-foreground text-sm">{trip.location}</div>
                      <div className="text-muted-foreground text-sm">{trip.dates}</div>
                      <div className="text-muted-foreground text-sm">{trip.guests} guest(s)</div>
                      <div className="text-muted-foreground text-xs">Status: {trip.status}</div>
                    </div>
                    {trip.image && (
                      <img src={trip.image} alt="Listing" className="w-32 h-24 object-cover rounded mt-2 sm:mt-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="earnings">
          <div className="rounded-lg border p-6 text-center">
            <h3 className="mb-2 text-xl font-medium">Total Earnings</h3>
            <div className="text-3xl font-bold">${earnings}</div>
            <p className="text-muted-foreground mt-2">Earnings are based on completed bookings for your listings.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
