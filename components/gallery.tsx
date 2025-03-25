"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { X } from "lucide-react"

// Sample gallery images
const galleryImages = [
  { src: "/placeholder.svg?height=600&width=800", alt: "Wedding ceremony" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Havan ceremony" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Griha Pravesh" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Satyanarayan Katha" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Mundan ceremony" },
  { src: "/placeholder.svg?height=600&width=800", alt: "Navagraha Shanti" },
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="py-16 md:py-24 bg-muted/30" id="gallery">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gallery</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Glimpses of sacred ceremonies performed by Pandit Ji over the years.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-medium">{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white"
              aria-label="Close"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={galleryImages[selectedImage].src || "/placeholder.svg"}
                alt={galleryImages[selectedImage].alt}
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

