import Hero from "@/components/hero"
import Services from "@/components/services"
import Experience from "@/components/experience"
import Gallery from "@/components/gallery"
import Knowledge from "@/components/knowledge"
import Reviews from "@/components/reviews"
import Faq from "@/components/faq"
import BookingCta from "@/components/booking-cta"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Toaster />
      <Hero />
      <Services />
      <Experience />
      <Gallery />
      <Knowledge />
      <Reviews />
      <Faq />
      <BookingCta />
    </main>
  )
}

