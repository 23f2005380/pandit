"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, Phone } from "lucide-react"

export default function BookingCta() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <section className="py-16 md:py-24 bg-primary/5" id="booking-cta">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Book Your Ceremony?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose from our available dates or request a call back from Pandit Ji to discuss your specific requirements.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-card rounded-lg p-6 shadow-md flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Book Available Dates</h3>
              <p className="text-muted-foreground mb-4 text-center">
                View Pandit Ji's calendar and select from available dates for your ceremony.
              </p>
              <Button asChild className="w-full">
                <Link href="/booking">Check Availability</Link>
              </Button>
            </div>

            <div className="bg-card rounded-lg p-6 shadow-md flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Request a Call Back</h3>
              <p className="text-muted-foreground mb-4 text-center">
                Fill out a form with your details and Pandit Ji will call you to discuss your needs.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/contact">Request Call</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

