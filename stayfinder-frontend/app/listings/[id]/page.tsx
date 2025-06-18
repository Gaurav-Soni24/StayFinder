"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import ImageGallery from "@/components/image-gallery"
import PropertyFeatures from "@/components/property-features"
import PropertyHost from "@/components/property-host"
import PropertyMap from "@/components/property-map"
import PropertyReviews from "@/components/property-reviews"
import AddReview from "@/components/add-review"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useProperty } from "@/hooks/use-property"

function SaveButton({ propertyId, initialWishlisted }: { propertyId: string, initialWishlisted: boolean }) {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { addToWishlist, removeFromWishlist } = await import("@/lib/wishlist");
      if (isWishlisted) {
        await removeFromWishlist(propertyId);
        setIsWishlisted(false);
        toast.success("Removed from favorites");
      } else {
        await addToWishlist(propertyId);
        setIsWishlisted(true);
        toast.success("Added to favorites");
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.error || e.message || "Failed to update favorites");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant={isWishlisted ? "default" : "outline"}
      size="sm"
      onClick={handleSave}
      disabled={isSaving}
    >
      {isSaving ? "Saving..." : isWishlisted ? "Saved" : "Save"}
    </Button>
  );
}

export default function PropertyPage() {
  const { id } = useParams()
  const { property, isLoading } = useProperty(id as string)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [guests, setGuests] = useState(1)

  if (isLoading) {
    return <PropertySkeleton />
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Property not found</h1>
        <p className="text-muted-foreground">The requested property does not exist or could not be loaded.</p>
      </div>
    )
  }

  const handleBooking = async () => {
    try {
      if (!date) {
        toast.error("Please select a date.");
        return;
      }
      const { bookListing } = await import("@/lib/bookings");
      await bookListing({ listingId: property.id, dates: date.toISOString(), guests });
      toast.success("Booking successful! Check your email for confirmation.");
      // Optionally reload or update UI
    } catch (error: any) {
      toast.error(error?.response?.data?.error || error.message || "Booking failed.");
    }
  }

  const incrementGuests = () => setGuests((prev) => Math.min(prev + 1, 16))
  const decrementGuests = () => setGuests((prev) => Math.max(prev - 1, 1))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">{property.title}</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center">
            ⭐ {property.rating} · {property.reviews.length} reviews
          </span>
          <span>·</span>
          <span className="font-medium">{property.location}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Share
          </Button>
          <SaveButton propertyId={property.id} initialWishlisted={property.isWishlisted} />
        </div>
      </div>

      <ImageGallery images={property.images} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 flex flex-col justify-between border-b pb-6 sm:flex-row">
            <div>
              <h2 className="text-xl font-medium">
                {property.type} hosted by {property.host.name}
              </h2>
              <p className="text-muted-foreground">
                {property.guests} guests · {property.bedrooms} bedrooms · {property.beds} beds · {property.bathrooms}{" "}
                bathrooms
              </p>
            </div>
            <PropertyHost host={property.host} />
          </div>

          <div className="mb-6 border-b pb-6">
            <h2 className="mb-4 text-xl font-medium">About this place</h2>
            <p className="whitespace-pre-line text-muted-foreground">{property.description}</p>
          </div>

          <PropertyFeatures features={property.amenities} />

          <Separator className="my-8" />

          <div className="mb-6">
            <h2 className="mb-4 text-xl font-medium">Location</h2>
            <p className="mb-4 text-muted-foreground">{property.location}</p>
            <PropertyMap location={property.coordinates} />
          </div>

          <Separator className="my-8" />

          <PropertyReviews reviews={property.reviews} rating={property.rating} />

          <div className="my-8">
            <h3 className="mb-2 text-lg font-semibold">Leave a Review</h3>
            <AddReview listingId={property.id} onReview={window.location.reload} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-2xl font-bold">${property.price}</span>
              <span className="text-muted-foreground">per night</span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>

              <div className="flex items-center rounded-md border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decrementGuests}
                  disabled={guests <= 1}
                  className="rounded-r-none"
                >
                  -
                </Button>
                <div className="flex-1 text-center">
                  {guests} {guests === 1 ? "guest" : "guests"}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={incrementGuests}
                  disabled={guests >= 16}
                  className="rounded-l-none"
                >
                  +
                </Button>
              </div>
            </div>

            <Button className="w-full" onClick={handleBooking}>
              Reserve
            </Button>

            <div className="mt-4 space-y-2">
              {(() => {
                let nights = 1;
                if (Array.isArray(date) && date[0] && date[1]) {
                  nights = Math.max(1, Math.ceil((date[1].getTime() - date[0].getTime()) / (1000 * 60 * 60 * 24)));
                }
                // If date is a single Date, keep nights = 1
                const subtotal = property.price * nights;
                const total = subtotal + property.cleaningFee + property.serviceFee;
                return (
                  <>
                    <div className="flex justify-between">
                      <span>${property.price} x {nights} night{nights > 1 ? "s" : ""}</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning fee</span>
                      <span>${property.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>${property.serviceFee}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PropertySkeleton() {
  return (
    <div className="container mx-auto animate-pulse px-4 py-8">
      <div className="mb-4 h-8 w-3/4 rounded-md bg-muted"></div>
      <div className="mb-6 h-6 w-1/2 rounded-md bg-muted"></div>
      <div className="aspect-video w-full rounded-xl bg-muted"></div>
      {/* More skeleton elements would go here */}
    </div>
  )
}
