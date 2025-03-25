"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { FlameIcon as Fire, Star, Heart, Home, Sparkles, Users } from "lucide-react"

const services = [
  {
    title: "Griha Pravesh",
    description: "House warming ceremony to bless your new home with positive energy and prosperity.",
    icon: Home,
  },
  {
    title: "Vivah (Wedding)",
    description: "Traditional wedding ceremonies performed with authentic Vedic mantras and rituals.",
    icon: Heart,
  },
  {
    title: "Satyanarayan Katha",
    description: "Sacred ritual dedicated to Lord Vishnu for prosperity, success and well-being.",
    icon: Star,
  },
  {
    title: "Havan/Homa",
    description: "Sacred fire ritual to purify the environment and invoke divine blessings.",
    icon: Fire,
  },
  {
    title: "Navagraha Shanti",
    description: "Rituals to pacify the nine planets and remove obstacles from your life.",
    icon: Sparkles,
  },
  {
    title: "Navchandi Pooja (-_-)",
    description: "A powerful Hindu ritual performed to worship Goddess Durga (Chandi) and is believed to bring prosperity, remove obstacles, and fulfill wishes, often performed during Navratri.",
    icon: Users,
  },
]

export default function Services() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

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
    <section className="py-16 md:py-24 bg-muted/50" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Sacred Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pandit Ji offers a wide range of traditional Hindu rituals and ceremonies performed with authentic Vedic
            mantras and procedures.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full transition-all hover:shadow-lg">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

