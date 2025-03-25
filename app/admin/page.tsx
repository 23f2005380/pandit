"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { seedAvailableSlots, seedSampleBookings, seedSampleCallRequests } from "@/lib/seed-database"
import { ArrowLeft, Database, Calendar, Users, Phone, LogOut, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { logout } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { collection, getDocs, doc, updateDoc, query, orderBy, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    slots?: number
    bookings?: number
    callRequests?: number
  }>({})
  const [callRequests, setCallRequests] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loadingData, setLoadingData] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoadingData(true)
    try {
      // Fetch call requests
      const callRequestsQuery = query(collection(db, "callRequests"), orderBy("createdAt", "desc"))
      const callRequestsSnapshot = await getDocs(callRequestsQuery)
      const callRequestsData: any[] = []
      callRequestsSnapshot.forEach((doc) => {
        callRequestsData.push({ id: doc.id, ...doc.data() })
      })
      setCallRequests(callRequestsData)

      // Fetch bookings
      const bookingsQuery = query(collection(db, "bookings"), orderBy("createdAt", "desc"))
      const bookingsSnapshot = await getDocs(bookingsQuery)
      const bookingsData: any[] = []
      bookingsSnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() })
      })
      setBookings(bookingsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleSeedAvailability = async () => {
    setLoading(true)
    try {
      const count = await seedAvailableSlots()
      setResults((prev) => ({ ...prev, slots: count }))
      toast({
        title: "Success!",
        description: `Added ${count} availability slots to the database.`,
      })
    } catch (error) {
      console.error("Error seeding availability:", error)
      toast({
        title: "Error",
        description: "Failed to seed availability data. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedBookings = async () => {
    setLoading(true)
    try {
      const count = await seedSampleBookings()
      setResults((prev) => ({ ...prev, bookings: count }))
      toast({
        title: "Success!",
        description: `Added ${count} sample bookings to the database.`,
      })
      fetchData() // Refresh data
    } catch (error) {
      console.error("Error seeding bookings:", error)
      toast({
        title: "Error",
        description: "Failed to seed booking data. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSeedCallRequests = async () => {
    setLoading(true)
    try {
      const count = await seedSampleCallRequests()
      setResults((prev) => ({ ...prev, callRequests: count }))
      toast({
        title: "Success!",
        description: `Added ${count} sample call requests to the database.`,
      })
      fetchData() // Refresh data
    } catch (error) {
      console.error("Error seeding call requests:", error)
      toast({
        title: "Error",
        description: "Failed to seed call request data. Check console for details.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const updateCallRequestStatus = async (id: string, status: string) => {
    try {
      const docRef = doc(db, "callRequests", id)
      await updateDoc(docRef, { status })

      toast({
        title: "Status updated",
        description: "Call request status has been updated successfully.",
      })

      // Update local state
      setCallRequests((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const docRef = doc(db, "bookings", id)
      await updateDoc(docRef, { status })

      toast({
        title: "Status updated",
        description: "Booking status has been updated successfully.",
      })

      // Update local state
      setBookings((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Cancelled
          </Badge>
        )
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Confirmed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link href="/" className="flex items-center text-muted-foreground hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
        <Button variant="outline" onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manage bookings, call requests, and availability slots.
          </p>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="calls">
              <Phone className="mr-2 h-4 w-4" />
              Call Requests
            </TabsTrigger>
            <TabsTrigger value="create-slot">
              <Plus className="mr-2 h-4 w-4" />
              Create Slot
            </TabsTrigger>
            <TabsTrigger value="seed">
              <Database className="mr-2 h-4 w-4" />
              Seed Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Booking Appointments
                </CardTitle>
                <CardDescription>View and manage all booking appointments.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings found. Generate sample data or wait for customer bookings.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>{booking.time}</TableCell>
                            <TableCell>{booking.service}</TableCell>
                            <TableCell>{booking.customerName || "N/A"}</TableCell>
                            <TableCell>{getStatusBadge(booking.status)}</TableCell>
                            <TableCell>
                              <Select
                                defaultValue={booking.status}
                                onValueChange={(value) => updateBookingStatus(booking.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Back Requests
                </CardTitle>
                <CardDescription>View and manage customer call back requests.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingData ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : callRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No call requests found. Wait for customers to request a call back.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>{request.name}</TableCell>
                            <TableCell>{request.phone}</TableCell>
                            <TableCell>{request.email || "N/A"}</TableCell>
                            <TableCell>{request.service}</TableCell>
                            <TableCell>
                              {request.createdAt?.toDate ? format(request.createdAt.toDate(), "MMM d, yyyy") : "N/A"}
                            </TableCell>
                            <TableCell>{getStatusBadge(request.status)}</TableCell>
                            <TableCell>
                              <Select
                                defaultValue={request.status}
                                onValueChange={(value) => updateCallRequestStatus(request.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create-slot" className="mt-6">
            <CreateSlotForm onSuccess={fetchData} />
          </TabsContent>

          <TabsContent value="seed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    Availability Slots
                  </CardTitle>
                  <CardDescription>Generate sample availability slots for the next 30 days.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSeedAvailability} disabled={loading} className="w-full">
                    {loading ? "Processing..." : "Seed Availability Data"}
                  </Button>

                  {results.slots !== undefined && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Successfully added {results.slots} availability slots.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Sample Bookings
                  </CardTitle>
                  <CardDescription>Generate sample bookings with random customer data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSeedBookings} disabled={loading} className="w-full">
                    {loading ? "Processing..." : "Seed Booking Data"}
                  </Button>

                  {results.bookings !== undefined && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Successfully added {results.bookings} sample bookings.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Requests
                  </CardTitle>
                  <CardDescription>Generate sample call requests with random customer data.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={handleSeedCallRequests} disabled={loading} className="w-full">
                    {loading ? "Processing..." : "Seed Call Request Data"}
                  </Button>

                  {results.callRequests !== undefined && (
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                      Successfully added {results.callRequests} sample call requests.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function CreateSlotForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    services: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const services = [
    { id: "griha-pravesh", name: "Griha Pravesh" },
    { id: "wedding", name: "Wedding Ceremony" },
    { id: "satyanarayan", name: "Satyanarayan Katha" },
    { id: "havan", name: "Havan/Homa" },
    { id: "mundan", name: "Mundan Ceremony" },
    { id: "navagraha", name: "Navagraha Shanti" },
  ]

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        services: [...prev.services, value],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter((service) => service !== value),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.date || !formData.time || formData.services.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Add the slot to Firestore
      await addDoc(collection(db, "availableSlots"), {
        date: formData.date,
        time: formData.time,
        availableServices: formData.services,
        booked: false,
        createdAt: new Date(),
      })

      toast({
        title: "Slot created",
        description: "Availability slot has been created successfully.",
      })

      // Reset form
      setFormData({
        date: "",
        time: "",
        services: [],
      })

      // Refresh data
      onSuccess()
    } catch (error) {
      console.error("Error creating slot:", error)
      toast({
        title: "Error",
        description: "Failed to create slot. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Create Availability Slot
        </CardTitle>
        <CardDescription>Manually add a new availability slot for bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Services *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service.id}
                    value={service.id}
                    checked={formData.services.includes(service.id)}
                    onChange={handleServiceChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor={service.id} className="text-sm font-normal">
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Slot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Import Label component
function Label({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  )
}

