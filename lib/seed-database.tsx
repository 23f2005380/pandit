import { db } from "./firebase"
import { collection, addDoc, getDocs, deleteDoc, query, where, doc, updateDoc } from "firebase/firestore"
import { services } from "./data"

// Function to seed available slots in the database
export async function seedAvailableSlots() {
  try {
    // First, clear existing data
    const existingSlots = await getDocs(collection(db, "availableSlots"))
    const deletePromises = existingSlots.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    // Generate dates for the next 30 days
    const slots = []
    const startDate = new Date()

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date()
      currentDate.setDate(startDate.getDate() + i)

      // Skip adding slots for past dates
      if (currentDate < new Date()) continue

      const dateStr = currentDate.toISOString().split("T")[0]

      // Generate 2-4 random time slots for each date
      const numSlots = Math.floor(Math.random() * 3) + 2 // 2-4 slots
      const possibleTimes = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
      ]

      // Shuffle and pick random times
      const shuffled = [...possibleTimes].sort(() => 0.5 - Math.random())
      const selectedTimes = shuffled.slice(0, numSlots)

      // For each time slot, assign 1-3 random services that are available
      for (const time of selectedTimes) {
        // Shuffle services and pick 1-3 random ones
        const shuffledServices = [...services].sort(() => 0.5 - Math.random())
        const numServices = Math.floor(Math.random() * 3) + 1 // 1-3 services
        const availableServices = shuffledServices.slice(0, numServices).map((s) => s.id)

        slots.push({
          date: dateStr,
          time: time,
          availableServices: availableServices,
          booked: false,
          createdAt: new Date(),
        })
      }
    }

    // Add all slots to Firestore
    const addPromises = slots.map((slot) => addDoc(collection(db, "availableSlots"), slot))
    await Promise.all(addPromises)

    console.log(`Successfully added ${slots.length} availability slots to the database.`)
    return slots.length
  } catch (error) {
    console.error("Error seeding available slots:", error)
    throw error
  }
}

// Function to seed sample bookings
export async function seedSampleBookings() {
  try {
    // First, clear existing data
    const existingBookings = await getDocs(collection(db, "bookings"))
    const deletePromises = existingBookings.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    // Sample customer names
    const customerNames = [
      "Rahul Sharma",
      "Priya Patel",
      "Amit Singh",
      "Sunita Gupta",
      "Vikram Mehta",
      "Ananya Reddy",
      "Rajesh Kumar",
      "Neha Verma",
    ]

    // Sample phone numbers
    const phoneNumbers = [
      "+91 98765 43210",
      "+91 87654 32109",
      "+91 76543 21098",
      "+91 65432 10987",
      "+91 54321 09876",
      "+91 43210 98765",
      "+91 32109 87654",
      "+91 21098 76543",
    ]

    // Get available slots
    const availableSlotsQuery = query(collection(db, "availableSlots"), where("booked", "==", false))
    const availableSlotsSnapshot = await getDocs(availableSlotsQuery)
    const availableSlots: any[] = []
    availableSlotsSnapshot.forEach((doc) => {
      availableSlots.push({ id: doc.id, ...doc.data() })
    })

    if (availableSlots.length === 0) {
      throw new Error("No available slots found. Please seed availability slots first.")
    }

    // Create 5-10 sample bookings
    const numBookings = Math.min(Math.floor(Math.random() * 6) + 5, availableSlots.length) // 5-10 bookings or max available
    const bookings = []

    // Shuffle available slots
    const shuffledSlots = [...availableSlots].sort(() => 0.5 - Math.random())
    const selectedSlots = shuffledSlots.slice(0, numBookings)

    for (let i = 0; i < numBookings; i++) {
      const slot = selectedSlots[i]

      // Random customer
      const customerIndex = Math.floor(Math.random() * customerNames.length)

      // Random service from available services for this slot
      const serviceId = slot.availableServices[Math.floor(Math.random() * slot.availableServices.length)]
      const service = services.find((s) => s.id === serviceId)?.name || serviceId

      const booking = {
        date: slot.date,
        time: slot.time,
        service: service,
        slotId: slot.id,
        customerName: customerNames[customerIndex],
        phoneNumber: phoneNumbers[customerIndex],
        email: `${customerNames[customerIndex].toLowerCase().replace(" ", ".")}@example.com`,
        status: Math.random() > 0.3 ? "confirmed" : "pending", // 70% confirmed, 30% pending
        createdAt: new Date(),
      }

      // Add booking to Firestore
      const bookingRef = await addDoc(collection(db, "bookings"), booking)

      // Mark slot as booked
      await updateDoc(doc(db, "availableSlots", slot.id), {
        booked: true,
        bookedBy: bookingRef.id,
        bookedAt: new Date(),
      })

      bookings.push(booking)
    }

    console.log(`Successfully added ${bookings.length} sample bookings to the database.`)
    return bookings.length
  } catch (error) {
    console.error("Error seeding sample bookings:", error)
    throw error
  }
}

// Function to seed sample call requests
export async function seedSampleCallRequests() {
  try {
    // First, clear existing data
    const existingRequests = await getDocs(collection(db, "callRequests"))
    const deletePromises = existingRequests.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises)

    // Sample customer names
    const customerNames = [
      "Rahul Sharma",
      "Priya Patel",
      "Amit Singh",
      "Sunita Gupta",
      "Vikram Mehta",
      "Ananya Reddy",
      "Rajesh Kumar",
      "Neha Verma",
    ]

    // Sample phone numbers
    const phoneNumbers = [
      "+91 98765 43210",
      "+91 87654 32109",
      "+91 76543 21098",
      "+91 65432 10987",
      "+91 54321 09876",
      "+91 43210 98765",
      "+91 32109 87654",
      "+91 21098 76543",
    ]

    // Sample messages
    const messages = [
      "I need more information about the Griha Pravesh ceremony.",
      "I'm planning a wedding and would like to discuss the details.",
      "Can you tell me more about the Satyanarayan Katha?",
      "I need to schedule a Mundan ceremony for my child.",
      "What items do I need to arrange for a Havan?",
      "I'd like to know the cost for a Navagraha Shanti puja.",
      "Do you perform ceremonies outside the city?",
      "What's the duration of a typical wedding ceremony?",
    ]

    // Create 5-8 sample call requests
    const numRequests = Math.floor(Math.random() * 4) + 5 // 5-8 requests
    const requests = []

    for (let i = 0; i < numRequests; i++) {
      // Random customer
      const customerIndex = Math.floor(Math.random() * customerNames.length)

      // Random service
      const serviceIndex = Math.floor(Math.random() * services.length)

      // Random message
      const messageIndex = Math.floor(Math.random() * messages.length)

      requests.push({
        name: customerNames[customerIndex],
        phone: phoneNumbers[customerIndex],
        email: `${customerNames[customerIndex].toLowerCase().replace(" ", ".")}@example.com`,
        service: services[serviceIndex].name,
        message: messages[messageIndex],
        status: Math.random() > 0.5 ? "pending" : "completed", // 50% pending, 50% completed
        createdAt: new Date(),
      })
    }

    // Add all requests to Firestore
    const addPromises = requests.map((request) => addDoc(collection(db, "callRequests"), request))
    await Promise.all(addPromises)

    console.log(`Successfully added ${requests.length} sample call requests to the database.`)
    return requests.length
  } catch (error) {
    console.error("Error seeding sample call requests:", error)
    throw error
  }
}

