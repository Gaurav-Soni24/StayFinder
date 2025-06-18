"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Fix marker icon issue with leaflet in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { getListings } from "@/lib/listings"
import type { Listing } from "@/types"

function LocationButton({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
  return (
    <Button
      type="button"
      className="w-full sm:w-auto"
      variant="secondary"
      onClick={() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              onLocate(pos.coords.latitude, pos.coords.longitude)
            },
            (err) => {
              alert("Unable to access your location.")
            }
          )
        } else {
          alert("Geolocation is not supported by your browser.")
        }
      }}
    >
      Use My Location
    </Button>
  )
}

export default function MapPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]) // Default to Delhi

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings()
        setListings(data)
      } catch (error) {
        console.error("Failed to fetch listings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handleMarkerClick = (listing: Listing) => {
    setSelectedListing(listing)
  }

  const handleClosePopup = () => {
    setSelectedListing(null)
  }

  const filteredListings = searchQuery
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : listings

  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
        <div className="mb-6 h-10 w-1/3 animate-pulse rounded-md bg-muted"></div>
        <div className="h-96 w-full animate-pulse rounded-lg bg-muted"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
      <h1 className="mb-4 text-xl font-bold sm:mb-8 sm:text-2xl">Map View</h1>
      {/* Controls: Search, Location, Sidebar toggle */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center">
        <div className="flex w-full gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              size="sm"
              className="shrink-0"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <LocationButton
            onLocate={(lat, lng) => {
              setUserLocation({ lat, lng })
              setMapCenter([lat, lng])
            }}
          />
          <Button
            type="button"
            variant="secondary"
            className="sm:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? "Hide List" : "Show List"}
          </Button>
        </div>
      </div>
      <Separator className="mb-4 sm:mb-6" />

      <div className="relative flex flex-col gap-4 sm:gap-6 lg:flex-row">
        {/* Listings Sidebar (responsive) */}
        <div
          className={`z-10 w-full space-y-4 bg-background transition-all duration-300 lg:static lg:block lg:w-1/3 ${
            sidebarOpen ? "fixed left-0 top-0 h-full overflow-y-auto p-4 shadow-lg sm:static sm:h-auto sm:p-0" :
            "hidden sm:block"
          }`}
        >
          <h2 className="text-lg font-semibold">
            {filteredListings.length} Properties Found
          </h2>
          <div className="max-h-80 space-y-2 overflow-y-auto sm:max-h-96 lg:max-h-[600px]">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md ${
                    selectedListing?.id === listing.id 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "border-border"
                  }`}
                  onClick={() => {
                    handleMarkerClick(listing)
                    setSidebarOpen(false)
                  }}
                >
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <img
                        src={listing.images?.[0] || "/placeholder.svg"}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                      <p className="mt-1">
                        <span className="font-semibold">${listing.price}</span>
                        <span className="text-sm text-muted-foreground"> / night</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="mb-2 text-lg font-medium">No properties found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="relative h-96 w-full overflow-hidden rounded-lg border lg:h-[600px] lg:w-2/3">
          <MapContainer
            center={
              filteredListings.length > 0 && filteredListings[0].coordinates
                ? [filteredListings[0].coordinates.lat, filteredListings[0].coordinates.lng]
                : [20, 0]
            }
            zoom={filteredListings.length > 0 ? 6 : 2}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom={true}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocation && (
              <Marker
                position={[userLocation.lat, userLocation.lng]}
                icon={new L.Icon({
                  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-red.png",
                  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })}
              >
                <Popup>Your Location</Popup>
              </Marker>
            )}
            {filteredListings.map((listing) =>
              listing.coordinates &&
              typeof listing.coordinates.lat === "number" &&
              typeof listing.coordinates.lng === "number" ? (
                <Marker
                  key={listing.id}
                  position={[listing.coordinates.lat, listing.coordinates.lng]}
                  eventHandlers={{
                    click: () => handleMarkerClick(listing),
                  }}
                >
                  <Popup>
                    <div className="p-2">
                      <div className="flex gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={listing.images?.[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium line-clamp-2">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{listing.location}</p>
                          <p className="mt-1">
                            <span className="font-semibold">${listing.price}</span>
                            <span className="text-sm text-muted-foreground"> / night</span>
                          </p>
                          <Button
                            size="sm"
                            className="mt-2"
                            onClick={() => (window.location.href = `/listings/${listing.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>

          {/* Selected Listing Popup Overlay */}
          {selectedListing && (
            <div className="absolute bottom-4 left-4 right-4 z-10 max-w-md rounded-lg border bg-background p-4 shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={handleClosePopup}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              
              <div className="flex gap-4 pr-8">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                  <img
                    src={selectedListing.images?.[0] || "/placeholder.svg"}
                    alt={selectedListing.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1">{selectedListing.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {selectedListing.location}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">${selectedListing.price}</span>
                    <span className="text-sm text-muted-foreground"> / night</span>
                  </p>
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => (window.location.href = `/listings/${selectedListing.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}