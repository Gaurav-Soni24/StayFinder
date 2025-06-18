"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon, Upload, X } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Listing } from "@/types"

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  location: z.string().min(3, { message: "Location is required" }),
  type: z.string(),
  bedrooms: z.coerce.number().min(1),
  beds: z.coerce.number().min(1),
  bathrooms: z.coerce.number().min(1),
  guests: z.coerce.number().min(1),
  cleaningFee: z.coerce.number().min(0),
  serviceFee: z.coerce.number().min(0),
  images: z.array(z.string()).min(1, { message: "At least one image is required" }),
})

interface ListingFormProps {
  onSubmit: (data: Listing) => void
  initialData?: Partial<Listing>
}

// Curated list of verified Unsplash photo IDs for property listings
const VERIFIED_UNSPLASH_PHOTO_IDS = [
  "photo-1568605114967-8130f3a36994",
  "photo-1506744038136-46273834b3fb",
  "photo-1512918728675-ed5a9ecdebfd",
  "photo-1560448204-61ef83c7a4b0",
  "photo-1586023492125-27b2c045ee7d",
  "photo-1560185127-6ed74b5ad5bd",
  "photo-1555685812-4b943f6d9a1e",
  "photo-1558618666-fbd9c3cd3bac",
  "photo-1571055107559-3e67626fa8be",
  "photo-1502005229762-cf1b2da7ee95",
  "photo-1484154218962-a197aa94b90e",
  "photo-1558618047-3c2123ee2f6a",
  "photo-1571055107995-81dcfb3b54f7",
  "photo-1493809842364-78817add7ffb",
  "photo-1554995207-c18ebf6b493b",
  "photo-1507089947368-19c1da9775ae",
  "photo-1465101046530-73398c7f28ca",
  "photo-1522708323590-d24dbb6b0267",
  "photo-1465101178521-c1a9136a3b99",
  "photo-1519125323398-675f0ddb6308",
  "photo-1600566753086-00f18fb6b3ea",
  "photo-1600566752355-35792bedcfea",
  "photo-1600607687939-ce8a6c25118c",
  "photo-1600607687644-c7171b42498b",
  "photo-1600607688969-a5bfcd646154",
  "photo-1600566753190-17f0baa2a6c3",
  "photo-1600566752229-450dd47c2c64",
  "photo-1600566753051-6a4dda5fb60b",
  "photo-1600566752734-d1540185c537",
  "photo-1600585154340-be6161a56a0c",
]

const generateUnsplashUrl = (photoId: string): string => {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1000`
}

// Hook to handle image fallback logic
const useImageFallback = (imageUrls: string[], setImageUrls: (urls: string[]) => void, updateForm: (urls: string[]) => void) => {
  const [usedPhotoIds, setUsedPhotoIds] = useState<Set<string>>(new Set())

  const getNextAvailableImage = (): string => {
    const availableIds = VERIFIED_UNSPLASH_PHOTO_IDS.filter(id => !usedPhotoIds.has(id))
    
    if (availableIds.length === 0) {
      // If all images have been used, reset and start over
      setUsedPhotoIds(new Set())
      return generateUnsplashUrl(VERIFIED_UNSPLASH_PHOTO_IDS[0])
    }
    
    const randomIdx = Math.floor(Math.random() * availableIds.length)
    const selectedId = availableIds[randomIdx]
    setUsedPhotoIds(prev => new Set(prev).add(selectedId))
    
    return generateUnsplashUrl(selectedId)
  }

  const handleImageError = (failedIndex: number) => {
    const newImageUrl = getNextAvailableImage()
    const updatedUrls = [...imageUrls]
    updatedUrls[failedIndex] = newImageUrl
    
    setImageUrls(updatedUrls)
    updateForm(updatedUrls)
  }

  return { handleImageError, getNextAvailableImage }
}

export default function ListingForm({ onSubmit, initialData }: ListingFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialData?.images || [generateUnsplashUrl(VERIFIED_UNSPLASH_PHOTO_IDS[0])],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || 100,
      location: initialData?.location || "",
      type: initialData?.type || "Entire place",
      bedrooms: initialData?.bedrooms || 1,
      beds: initialData?.beds || 1,
      bathrooms: initialData?.bathrooms || 1,
      guests: initialData?.guests || 2,
      cleaningFee: initialData?.cleaningFee || 50,
      serviceFee: initialData?.serviceFee || 20,
      images: imageUrls,
    },
  })

  const { handleImageError, getNextAvailableImage } = useImageFallback(
    imageUrls, 
    setImageUrls, 
    (urls) => form.setValue("images", urls)
  )

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || `listing-${Date.now()}`,
      rating: initialData?.rating || 4.5,
      reviews: initialData?.reviews || [],
      host: initialData?.host || {
        id: "host-1",
        name: "John Doe",
        avatar: "https://i.pravatar.cc/150?img=3",
        isSuperhost: true,
        joinDate: "2018",
        rating: 4.9,
      },
      amenities: initialData?.amenities || ["Wifi", "Kitchen", "Free parking", "TV", "Pool"],
      availableDates: date ? `Available from ${format(date, "MMM d")}` : "Available now",
      coordinates: initialData?.coordinates || { lat: 34.0522, lng: -118.2437 },
    })
  }

  const addImageUrl = () => {
    const newUrl = getNextAvailableImage()
    const updatedUrls = [...imageUrls, newUrl]
    setImageUrls(updatedUrls)
    form.setValue("images", updatedUrls)
  }

  const removeImage = (indexToRemove: number) => {
    const updatedUrls = imageUrls.filter((_, index) => index !== indexToRemove)
    setImageUrls(updatedUrls)
    form.setValue("images", updatedUrls)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Cozy apartment in the heart of the city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per night ($)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your property..." className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Entire place">Entire place</SelectItem>
                    <SelectItem value="Private room">Private room</SelectItem>
                    <SelectItem value="Shared room">Shared room</SelectItem>
                    <SelectItem value="Hotel room">Hotel room</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Guests</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="beds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beds</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="0.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="cleaningFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cleaning Fee ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Fee ($)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem>
          <FormLabel>Availability</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <FormDescription>Select the date from which your property will be available</FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <FormLabel>Images</FormLabel>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Property image ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={() => handleImageError(index)}
                      onLoad={() => {
                        // Optional: You can add a success callback here if needed
                        console.log(`Image ${index + 1} loaded successfully`)
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" className="aspect-square flex-col gap-2" onClick={addImageUrl}>
                  <Upload className="h-6 w-6" />
                  <span>Add Image</span>
                </Button>
              </div>
              <FormDescription>
                Add at least one image of your property. Hover over images to remove them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update Listing" : "Create Listing"}
        </Button>
      </form>
    </Form>
  )
}