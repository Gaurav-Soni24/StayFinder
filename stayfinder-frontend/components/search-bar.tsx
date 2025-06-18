"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SearchBar() {
  const router = useRouter()
  const [location, setLocation] = useState<string>("")
  const [checkIn, setCheckIn] = useState<Date | undefined>()
  const [checkOut, setCheckOut] = useState<Date | undefined>()
  const [guests, setGuests] = useState<string>("")

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const params = new URLSearchParams()
    if (location) params.append("location", location)
    if (checkIn) params.append("checkIn", checkIn.toISOString())
    if (checkOut) params.append("checkOut", checkOut.toISOString())
    if (guests) params.append("guests", guests)
    router.push("/?" + params.toString())
  }

  return (
    <form onSubmit={handleSearch} className="flex w-full flex-col gap-2 rounded-full border bg-background p-2 shadow-sm sm:flex-row sm:items-center">
      <div className="relative flex-1 px-3 py-2">
        <label htmlFor="location" className="text-xs font-medium text-muted-foreground">
          Where
        </label>
        <Input
          id="location"
          placeholder="Search destinations"
          className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>

      <div className="flex flex-1 flex-col border-t px-3 py-2 sm:border-l sm:border-t-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto justify-start p-0 font-normal shadow-none">
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-muted-foreground">Check in</span>
                <span className="text-sm">{checkIn ? format(checkIn, "PPP") : "Add dates"}</span>
              </div>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 flex-col border-t px-3 py-2 sm:border-l sm:border-t-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="h-auto justify-start p-0 font-normal shadow-none">
              <div className="flex flex-col items-start">
                <span className="text-xs font-medium text-muted-foreground">Check out</span>
                <span className="text-sm">{checkOut ? format(checkOut, "PPP") : "Add dates"}</span>
              </div>
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 flex-col border-t px-3 py-2 sm:border-l sm:border-t-0">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground">Who</span>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="h-auto border-0 bg-transparent p-0 shadow-none [&>span]:text-sm [&>span]:font-normal focus:ring-0">
              <SelectValue placeholder="Add guests" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 guest</SelectItem>
              <SelectItem value="2">2 guests</SelectItem>
              <SelectItem value="3">3 guests</SelectItem>
              <SelectItem value="4">4 guests</SelectItem>
              <SelectItem value="5">5 guests</SelectItem>
              <SelectItem value="6">6+ guests</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </form>
  )
}