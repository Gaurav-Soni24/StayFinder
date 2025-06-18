"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Pencil, Star, Trash } from "lucide-react"

import type { Listing } from "@/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import toast from "react-hot-toast"
import { addToWishlist, removeFromWishlist } from "@/lib/wishlist"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ListingCardProps {
  listing: Listing
  className?: string
  isManageable?: boolean
  onDelete?: () => void
}

export default function ListingCard({ listing, className, isManageable = false, onDelete }: ListingCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [wishlisted, setWishlisted] = useState(!!listing.isWishlisted)
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setShowDeleteDialog(false)
    onDelete?.()
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      if (wishlisted) {
        await removeFromWishlist(listing.id)
        setWishlisted(false)
        toast.success("Removed from wishlist")
      } else {
        await addToWishlist(listing.id)
        setWishlisted(true)
        toast.success("Added to wishlist")
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err.message || "Failed to update wishlist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md",
          className,
        )}
      >
        <div className="relative aspect-square overflow-hidden">
          <Link href={`/listings/${listing.id}`}>
            <Image
              src={listing.images[0] || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </Link>


          {isManageable && (
            <div className="absolute right-2 top-12">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/listings/edit/${listing.id}`}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex flex-col p-4">
          <Link href={`/listings/${listing.id}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium line-clamp-1">{listing.title}</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm">{listing.rating}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{listing.location}</p>
            <p className="mt-2 text-sm text-muted-foreground">{listing.availableDates}</p>
            <p className="mt-1">
              <span className="font-medium">${listing.price}</span>{" "}
              <span className="text-sm text-muted-foreground">night</span>
            </p>
          </Link>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
