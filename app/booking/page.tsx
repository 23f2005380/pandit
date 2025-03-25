"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { bookAppointment } from "@/lib/firebase"
import { ArrowLeft, CalendarIcon, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Service options
const serviceOptions = [
  { id: "griha-pravesh", name: "Griha Pravesh", description: "House warming ceremony" },
  { id: "wedding", name: 'Wedding  name: "Griha Pravesh', description: "House warming ceremony" },
  { id: "wedding", name: "Wedding Ceremony", description: "Traditional wedding ceremonies" },
  { id: "satyanarayan", name: "Satyanarayan Katha", description: "Sacred ritual for Lord Vishnu" },
  { id: "havan", name: "Havan/Homa", description: "Sacred fire ritual" },
  { id: "mundan", name: "Mundan Ceremony", description: "First hair-cutting ceremony" },
  { id: "navagraha", name: "Navagraha Shanti", description: "Rituals to pacify the nine planets" },
]

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [availableSlotsData, setAvailableSlotsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState(1) // 1: Service, 2: Date, 3: Time

  useEffect(() => {
    if (selectedService) {
      fetchAvailableSlotsForService(selectedService)
    }
  }, [selectedService])

  const fetchAvailableSlotsForService = async (serviceId: string) => {
    setIsLoading(true)
    try {
      // Convert service name to ID format if needed
      const formattedServiceId = serviceId.toLowerCase().replace(/\s+/g, "-")

      // Query for slots that have this service available and are not booked
      const q = query(
        collection(db, "availableSlots"),
        where("booked", "==", false),
        where("availableServices", "array-contains", formattedServiceId),
      )

      const querySnapshot = await getDocs(q)

      const slots: any[] = []
      querySnapshot.forEach((doc) => {
        slots.push({ id: doc.id, ...doc.data() })
      })

      setAvailableSlotsData(slots)

      // Reset date and time selections
      setDate(undefined)
      setSelectedTime(null)

      // Move to next step
      setStep(2)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      toast({
        title: "Error",
        description: "Failed to load available slots. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter available times for the selected date
  const getAvailableTimesForDate = (selectedDate: Date | undefined) => {
    if (!selectedDate) return []

    const dateStr = format(selectedDate, "yyyy-MM-dd")
    return availableSlotsData.filter((slot) => slot.date === dateStr)
  }

  const availableTimes = date ? getAvailableTimesForDate(date) : []

  const handleBooking = async () => {
    if (!date || !selectedTime || !selectedService) {
      toast({
        title: "Missing information",
        description: "Please select a date, time, and service.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Find the selected slot
      const dateStr = format(date, "yyyy-MM-dd")
      const selectedSlot = availableSlotsData.find((slot) => slot.date === dateStr && slot.time === selectedTime)

      if (!selectedSlot) {
        throw new Error("Selected slot not found")
      }

      await bookAppointment({
        date: dateStr,
        time: selectedTime,
        service: selectedService,
        slotId: selectedSlot.id,
      })

      toast({
        title: "Booking successful!",
        description: `Your appointment has been booked for ${format(date, "MMMM d, yyyy")} at ${selectedTime}.`,
      })

      // Reset form
      setSelectedService(null)
      setDate(undefined)
      setSelectedTime(null)
      setStep(1)
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast({
        title: "Booking failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)
    setStep(3)
  }

  const resetSelection = () => {
    setSelectedService(null)
    setDate(undefined)
    setSelectedTime(null)
    setStep(1)
  }

  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <Link href="/" className="flex items-center text-muted-foreground mb-8 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Book Your Ceremony</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your preferred service, date, and time to book a ceremony with Pandit Ji.
          </p>
        </div>

        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">Book by Calendar</TabsTrigger>
            <TabsTrigger value="request">Request a Call</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Book Your Ceremony</CardTitle>
                <CardDescription>
                  {step === 1
                    ? "Step 1: Select the service you're interested in."
                    : step === 2
                      ? "Step 2: Choose an available date for your ceremony."
                      : "Step 3: Select a time slot and confirm your booking."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium mb-4">Select Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {serviceOptions.map((service) => (
                        <Button
                          key={service.id}
                          variant={selectedService === service.id ? "default" : "outline"}
                          className="h-auto py-4 justify-start text-left flex flex-col items-start"
                          onClick={() => setSelectedService(service.id)}
                        >
                          <span className="font-medium">{service.name}</span>
                          <span className="text-xs text-muted-foreground mt-1">{service.description}</span>
                        </Button>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-6"
                      disabled={!selectedService || isLoading}
                      onClick={() => fetchAvailableSlotsForService(selectedService!)}
                    >
                      {isLoading ? "Loading..." : "Continue to Select Date"}
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Select Date
                      </h3>
                      <Button variant="ghost" size="sm" onClick={resetSelection}>
                        Change Service
                      </Button>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center h-[350px]">
                        <p className="text-muted-foreground">Loading available dates...</p>
                      </div>
                    ) : availableSlotsData.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No available slots found for this service.</p>
                        <Button variant="outline" className="mt-4" onClick={resetSelection}>
                          Select a Different Service
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                          disabled={(date) => {
                            // Disable past dates and dates with no available slots
                            const dateStr = format(date, "yyyy-MM-dd")
                            return date < new Date() || !availableSlotsData.some((slot) => slot.date === dateStr)
                          }}
                        />

                        {date && (
                          <div className="mt-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Clock className="mr-2 h-5 w-5" />
                              Select Time
                            </h3>

                            {availableTimes.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {availableTimes.map((slot) => (
                                  <Button
                                    key={slot.time}
                                    variant={selectedTime === slot.time ? "default" : "outline"}
                                    className="justify-center"
                                    onClick={() => handleTimeSelection(slot.time)}
                                  >
                                    {slot.time}
                                  </Button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No available times for this date.</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Confirm Booking
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                        Change Date/Time
                      </Button>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Booking Summary</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Service:</dt>
                          <dd className="font-medium">
                            {serviceOptions.find((s) => s.id === selectedService)?.name || selectedService}
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Date:</dt>
                          <dd className="font-medium">{date ? format(date, "MMMM d, yyyy") : ""}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Time:</dt>
                          <dd className="font-medium">{selectedTime}</dd>
                        </div>
                      </dl>
                    </div>

                    <Button className="w-full mt-6" onClick={handleBooking} disabled={loading}>
                      {loading ? "Processing..." : "Confirm Booking"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="request">
            <RequestCallForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function RequestCallForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.phone || !formData.service) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Submit form data to Firebase
      await addDoc(collection(db, "callRequests"), {
        ...formData,
        status: "pending",
        createdAt: new Date(),
      })

      toast({
        title: "Request submitted!",
        description: "Pandit Ji will call you back soon to discuss your requirements.",
      })

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting call request:", error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request a Call Back</CardTitle>
        <CardDescription>
          Fill in your details and Pandit Ji will call you to discuss your requirements.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-input bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-input bg-background"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service" className="text-sm font-medium">
              Service Interested In *
            </label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-input bg-background"
              required
            >
              <option value="">Select a service</option>
              <option value="Griha Pravesh">Griha Pravesh</option>
              <option value="Wedding Ceremony">Wedding Ceremony</option>
              <option value="Satyanarayan Katha">Satyanarayan Katha</option>
              <option value="Havan/Homa">Havan/Homa</option>
              <option value="Mundan Ceremony">Mundan Ceremony</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Additional Information
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 rounded-md border border-input bg-background resize-none"
            ></textarea>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

