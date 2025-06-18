"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import ListingForm from "@/components/listing-form";
import { getListing, updateListing } from "@/lib/listings";

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      try {
        if (!id || typeof id !== 'string') throw new Error('Invalid listing id');
        const data = await getListing(id);
        setListing(data);
      } catch (err) {
        toast.error("Failed to load listing");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }
    fetchListing();
  }, [id, router]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await updateListing(id, values);
      toast.success("Listing updated successfully!");
      router.push(`/listings/${id}`);
    } catch (err) {
      toast.error(err?.response?.data?.error || err.message || "Failed to update listing");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse h-8 w-1/4 rounded-md bg-muted mb-4"></div>
        <div className="animate-pulse h-40 w-full rounded-md bg-muted"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Listing not found</h1>
        <p className="text-muted-foreground">The requested listing does not exist or could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Edit Listing</h1>
      <ListingForm onSubmit={handleSubmit} initialData={listing} />
    </div>
  );
}
