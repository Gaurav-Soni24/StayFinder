"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Heart, Map, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const loginStatus = localStorage.getItem("isLoggedIn") === "true"
    setIsLoggedIn(loginStatus)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    setIsLoggedIn(false)
  }

  if (!isMounted) {
    return <NavbarSkeleton />
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                  <span className="font-bold">StayFinder</span>
                </Link>
                <Link href="/" className={pathname === "/" ? "text-foreground" : "text-muted-foreground"}>
                  Home
                </Link>
                <Link href="/map" className={pathname === "/map" ? "text-foreground" : "text-muted-foreground"}>
                  Map View
                </Link>
                {isLoggedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      className={pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/wishlist"
                      className={pathname === "/wishlist" ? "text-foreground" : "text-muted-foreground"}
                    >
                      Wishlist
                    </Link>
                    <Link
                      href="/profile"
                      className={pathname === "/profile" ? "text-foreground" : "text-muted-foreground"}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/notifications"
                      className={pathname === "/notifications" ? "text-foreground" : "text-muted-foreground"}
                    >
                      Notifications
                    </Link>
                  </>
                )}
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" className={pathname === "/login" ? "text-foreground" : "text-muted-foreground"}>
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className={pathname === "/register" ? "text-foreground" : "text-muted-foreground"}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button onClick={handleLogout} className="text-left text-muted-foreground">
                    Logout
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden text-xl font-bold sm:inline-block">StayFinder</span>
        </Link>

        <div className="hidden md:flex md:flex-1">
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/map"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/map" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Map View
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`transition-colors hover:text-foreground/80 ${
                  pathname === "/dashboard" ? "text-foreground" : "text-foreground/60"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden sm:flex">
            <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/map")}>
              <Map className="h-5 w-5" />
              <span className="sr-only">Map View</span>
            </Button>
          </div>

          {isLoggedIn && (
            <>
              <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/wishlist")}>
                <Heart className="h-5 w-5" />
                <span className="sr-only">Wishlist</span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => (window.location.href = "/notifications")}>
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </>
          )}

          <ModeToggle />

          {!isLoggedIn ? (
            <div className="hidden sm:flex sm:items-center sm:gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}

function NavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="flex-1">
          <div className="h-6 w-24 rounded bg-muted" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="h-8 w-8 rounded-full bg-muted" />
        </div>
      </div>
    </header>
  )
}
