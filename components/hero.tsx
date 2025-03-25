"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden" id="home">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Background"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-primary">पंडित विनय शास्त्री जी</h1>
            <p className="text-xl md:text-2xl mb-6 text-muted-foreground">
              Bringing peace and prosperity through sacred rituals and ceremonies
            </p>
            <p className="mb-8 text-muted-foreground max-w-lg mx-auto md:mx-0">
              With over 15 years of experience in performing traditional Hindu rituals, Pandit Vinay shastri Ji offers authentic poojas and ceremonies for all occasions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg">
                <Link href="/booking">Book a Pooja</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/#services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image src="/placeholder.svg?height=800&width=600" alt="Pandit Ji" fill className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

