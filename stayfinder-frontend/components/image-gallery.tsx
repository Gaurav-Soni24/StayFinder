"use client"

import { useState } from "react"
import Image from "next/image"
import { Grid, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ImageGalleryProps {
  images: string[]
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [showAllImages, setShowAllImages] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const mainImage = images[0]
  const gridImages = images.slice(1, 5)

  return (
    <>
      <div className="relative hidden overflow-hidden rounded-xl md:grid md:grid-cols-4 md:grid-rows-2 md:gap-2">
        <div className="col-span-2 row-span-2">
          <Image
            src={mainImage || "/placeholder.svg"}
            alt="Property main image"
            width={800}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>

        {gridImages.map((image, index) => (
          <div key={index} className="relative overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Property image ${index + 2}`}
              width={400}
              height={300}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-1"
          onClick={() => setShowAllImages(true)}
        >
          <Grid className="h-4 w-4" />
          Show all photos
        </Button>
      </div>

      <div className="relative md:hidden">
        <div className="relative aspect-video overflow-hidden rounded-xl">
          <Image src={mainImage || "/placeholder.svg"} alt="Property main image" fill className="object-cover" />
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 gap-1"
          onClick={() => setShowAllImages(true)}
        >
          <Grid className="h-4 w-4" />
          Show all photos
        </Button>
      </div>

      <Dialog open={showAllImages} onOpenChange={setShowAllImages}>
        <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto p-0">
          <DialogHeader className="p-4">
            <DialogTitle>All Photos</DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={() => setShowAllImages(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={cn(
                  "relative overflow-hidden rounded-lg",
                  selectedImage === index ? "ring-4 ring-primary" : "",
                )}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`Property image ${index + 1}`}
                  width={800}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
