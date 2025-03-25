// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHmI00KLQUeOdTbU7HzpX5KfT1LWqqeBw",
  authDomain: "padnit-577a4.firebaseapp.com",
  projectId: "padnit-577a4",
  storageBucket: "padnit-577a4.firebasestorage.app",
  messagingSenderId: "1011213940037",
  appId: "1:1011213940037:web:a15976c9f0d6567378fa2c",
  measurementId: "G-2BYG4X3STQ",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

// Booking functions
export async function bookAppointment(bookingData: {
  date: string
  time: string
  service: string
  slotId?: string
  customerName?: string
  phoneNumber?: string
  email?: string
}) {
  try {
    // Add the booking
    const docRef = await addDoc(collection(db, "bookings"), {
      ...bookingData,
      createdAt: new Date(),
      status: "confirmed",
    })

    // If a slotId is provided, mark the slot as booked
    if (bookingData.slotId) {
      const slotRef = doc(db, "availableSlots", bookingData.slotId)
      await updateDoc(slotRef, {
        booked: true,
        bookedBy: docRef.id,
        bookedAt: new Date(),
      })
    }

    return docRef.id
  } catch (error) {
    console.error("Error booking appointment:", error)
    throw error
  }
}

// Get available slots for a specific date
export async function getAvailableSlotsForDate(date: string) {
  try {
    const q = query(collection(db, "availableSlots"), where("date", "==", date), where("booked", "==", false))
    const querySnapshot = await getDocs(q)

    const slots: any[] = []
    querySnapshot.forEach((doc) => {
      slots.push({ id: doc.id, ...doc.data() })
    })

    return slots
  } catch (error) {
    console.error("Error getting available slots:", error)
    throw error
  }
}

// Get available slots for a specific service
export async function getAvailableSlotsForService(serviceId: string) {
  try {
    const q = query(
      collection(db, "availableSlots"),
      where("availableServices", "array-contains", serviceId),
      where("booked", "==", false),
    )
    const querySnapshot = await getDocs(q)

    const slots: any[] = []
    querySnapshot.forEach((doc) => {
      slots.push({ id: doc.id, ...doc.data() })
    })

    return slots
  } catch (error) {
    console.error("Error getting available slots for service:", error)
    throw error
  }
}

// Create a new availability slot
export async function createAvailabilitySlot(slotData: {
  date: string
  time: string
  availableServices: string[]
}) {
  try {
    const docRef = await addDoc(collection(db, "availableSlots"), {
      ...slotData,
      booked: false,
      createdAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating availability slot:", error)
    throw error
  }
}

// Update call request status
export async function updateCallRequestStatus(id: string, status: string) {
  try {
    const docRef = doc(db, "callRequests", id)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    })
    return true
  } catch (error) {
    console.error("Error updating call request status:", error)
    throw error
  }
}

// Update booking status
export async function updateBookingStatus(id: string, status: string) {
  try {
    const docRef = doc(db, "bookings", id)
    await updateDoc(docRef, {
      status,
      updatedAt: new Date(),
    })
    return true
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw error
  }
}

export { db, auth, storage }

