"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getListings } from "@/lib/listings";
import type { Listing } from "@/types";

// Fix marker icon issue with leaflet in Next.js
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  });
}

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
              onLocate(pos.coords.latitude, pos.coords.longitude);
            },
            (err) => {
              alert("Unable to access your location.");
            }
          );
        } else {
          alert("Geolocation is not supported by your browser.");
        }
      }}
    >
      Use My Location
    </Button>
  );
}

export default function MapComponent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleMarkerClick = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleClosePopup = () => {
    setSelectedListing(null);
  };

  const filteredListings = searchQuery
    ? listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : listings;

  // Responsive sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 h-8 w-1/4 animate-pulse rounded-md bg-muted"></div>
        <div className="mb-6 h-10 w-1/3 animate-pulse rounded-md bg-muted"></div>
        <div className="h-96 w-full animate-pulse rounded-lg bg-muted"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4 sm:px-4 sm:py-8">
      <h1 className="mb-4 text-xl font-bold sm:mb-8 sm:text-2xl">Map View</h1>
      {/* Controls: Search, Location, Sidebar toggle */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center">
        <div className="flex w-full gap-2">
          <div className="relative flex-1">
            <input
              placeholder="Search by location or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 border rounded px-2 py-1"
            />
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              size="sm"
              className="shrink-0"
            >
              Clear
            </Button>
          )}
          <LocationButton
            onLocate={(lat, lng) => {
              setUserLocation({ lat, lng });
              setMapCenter([lat, lng]);
            }}
          />
        </div>
      </div>
      <div className="relative h-[70vh] w-full rounded-lg overflow-hidden">
        <MapContainer center={mapCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={new L.Icon.Default({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
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
                          onClick={() => {
                            if (typeof window !== "undefined") {
                              window.location.href = `/listings/${listing.id}`;
                            }
                          }}
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
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = `/listings/${selectedListing.id}`;
                    }
                  }}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
