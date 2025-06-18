export interface Host {
  id: string
  name: string
  avatar: string
  isSuperhost: boolean
  joinDate: string
  rating: number
}

export interface Review {
  id: string
  user: {
    name: string
    avatar: string
  }
  rating: number
  date: string
  comment: string
}

export interface Listing {
  isWishlisted?: boolean;
  id: string
  title: string
  description: string
  price: number
  location: string
  type: string
  bedrooms: number
  beds: number
  bathrooms: number
  guests: number
  cleaningFee: number
  serviceFee: number
  images: string[]
  rating: number
  amenities: string[]
  availableDates: string
  coordinates: {
    lat: number
    lng: number
  }
  host: Host
  reviews: Review[]
}
