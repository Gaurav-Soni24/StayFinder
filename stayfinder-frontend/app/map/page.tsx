import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

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
}