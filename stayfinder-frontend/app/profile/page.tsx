"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Edit, LogOut, MapPin, Star, User } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getUserProfile } from "@/lib/user"
import { logout } from "@/lib/auth"

// Add helpers for API calls
async function updateProfile(profile: any) {
  const res = await fetch("/api/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to update profile");
  return res.json();
}

async function changePassword(currentPassword: string, newPassword: string) {
  const res = await fetch("/api/user/profile/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Failed to change password");
  return res.json();
}

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState<any>({})
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch (error) {
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        phone: profile.phone || '',
        birthdate: profile.birthdate || '',
        avatar: profile.avatar || '',
        location: profile.location || '',
      })
    }
  }, [profile])

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem("isLoggedIn")
      toast.success("Logged out successfully")
      router.push("/")
    } catch (error) {
      toast.error("Failed to log out")
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileLoading(true)
    try {
      await updateProfile(profileForm)
      toast.success("Profile updated successfully")
      setEditMode(false)
      // Update local profile state
      setProfile({ ...profile, ...profileForm })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    setPasswordLoading(true)
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      toast.success("Password updated successfully")
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex animate-pulse flex-col gap-4">
          <div className="h-8 w-1/4 rounded-md bg-muted"></div>
          <div className="h-6 w-1/3 rounded-md bg-muted"></div>
          <div className="h-32 w-32 rounded-full bg-muted"></div>
          <div className="h-6 w-1/2 rounded-md bg-muted"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Log Out
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="flex flex-col items-center p-6">
              <div className="relative mb-4">
                <div className="relative h-32 w-32 overflow-hidden rounded-full">
                  <Image
                    src={profile.avatar || "https://i.pravatar.cc/300?img=20"}
                    alt="Profile picture"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
              <h2 className="text-xl font-semibold">{profile.name}</h2>
              <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{profile.location}</span>
              </div>
              <div className="mb-4 flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>
                  {profile.rating} · {profile.reviewCount} reviews
                </span>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={() => setEditMode(true)}>
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Verification</CardTitle>
              <CardDescription>Your account verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Identity</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                  <span>Payment Method</span>
                </div>
                <span className="text-sm font-medium text-green-600">Verified</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="trips">
            <TabsList className="mb-6 grid w-full grid-cols-4">
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="trips">
              <Card>
                <CardHeader>
                  <CardTitle>Your Trips</CardTitle>
                  <CardDescription>View your upcoming and past trips</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile.trips && profile.trips.length > 0 ? (
                    <div className="space-y-4">
                      {profile.trips.map((trip: any) => (
                        <div
                          key={trip.id}
                          className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center"
                        >
                          <div className="relative aspect-video h-24 overflow-hidden rounded-md sm:aspect-square">
                            <Image
                              src={trip.image || "/placeholder.svg"}
                              alt={trip.location}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{trip.location}</h3>
                            <p className="text-sm text-muted-foreground">{trip.dates}</p>
                            <p className="text-sm">{trip.status}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                      <div className="mb-3 rounded-full bg-primary/10 p-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-primary"
                        >
                          <path d="M3 7h2c1 0 2 .6 2 1.5S6 10 5 10H3m0 4h2c1 0 2 .6 2 1.5S6 17 5 17H3" />
                          <path d="M13 17V7a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1a2 2 0 0 1-2-2V7" />
                        </svg>
                      </div>
                      <h3 className="mb-1 text-lg font-medium">No trips yet</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Time to start exploring! Book your first stay with StayFinder.
                      </p>
                      <Button onClick={() => router.push("/")}>Explore Stays</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                  <CardDescription>Places you've saved for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mb-3 rounded-full bg-primary/10 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-primary"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <h3 className="mb-1 text-lg font-medium">Your wishlist is empty</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Save properties you like by clicking the heart icon.
                    </p>
                    <Button onClick={() => router.push("/")}>Discover Places</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Your Reviews</CardTitle>
                  <CardDescription>Reviews you've written and received</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="written">
                    <TabsList className="mb-4 w-full">
                      <TabsTrigger value="written" className="flex-1">
                        Reviews You've Written
                      </TabsTrigger>
                      <TabsTrigger value="received" className="flex-1">
                        Reviews About You
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="written">
                      <div className="space-y-4">
                        {profile.writtenReviews && profile.writtenReviews.length > 0 ? (
                          profile.writtenReviews.map((review: any) => (
                            <div key={review.id} className="space-y-2 rounded-lg border p-4">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{review.propertyName}</h3>
                                <div className="flex items-center">
                                  {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating ? "fill-primary text-primary" : "text-muted"
                                        }`}
                                      />
                                    ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.date}</p>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg border p-4 text-center">
                            <p>You haven't written any reviews yet.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="received">
                      <div className="space-y-4">
                        {profile.receivedReviews && profile.receivedReviews.length > 0 ? (
                          profile.receivedReviews.map((review: any) => (
                            <div key={review.id} className="space-y-2 rounded-lg border p-4">
                              <div className="flex items-center gap-2">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                  <Image
                                    src={review.userAvatar || "/placeholder.svg"}
                                    alt={review.userName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium">{review.userName}</h3>
                                  <p className="text-sm text-muted-foreground">{review.date}</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating ? "fill-primary text-primary" : "text-muted"
                                      }`}
                                    />
                                  ))}
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="rounded-lg border p-4 text-center">
                            <p>You haven't received any reviews yet.</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-medium">Personal Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Full Name</label>
                          <input
                            type="text"
                            defaultValue={profile.name}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Email</label>
                          <input
                            type="email"
                            defaultValue={profile.email}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Phone Number</label>
                          <input
                            type="tel"
                            defaultValue={profile.phone}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Date of Birth</label>
                          <input
                            type="date"
                            defaultValue={profile.birthdate}
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Receive emails about your account activity</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" defaultChecked className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Marketing Emails</p>
                          <p className="text-sm text-muted-foreground">Receive emails about promotions and news</p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-4 text-lg font-medium">Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium">Current Password</label>
                        <input
                          type="password"
                          className="w-full rounded-md border border-input bg-background px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium">New Password</label>
                          <input
                            type="password"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full rounded-md border border-input bg-background px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
