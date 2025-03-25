"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Award, BookOpen, Users, Calendar } from "lucide-react"

const stats = [
  { value: "25+", label: "Years Experience", icon: Calendar },
  { value: "1000+", label: "Ceremonies Performed", icon: BookOpen },
  { value: "500+", label: "Satisfied Families", icon: Users },
  { value: "10+", label: "Specializations", icon: Award },
]

export default function Experience() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24" id="about">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
            className="relative h-[500px] rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src="/placeholder.svg?height=1000&width=800"
              alt="Pandit Ji performing ceremony"
              fill
              className="object-cover"
            />
          </motion.div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience & Expertise</h2>
              <p className="text-muted-foreground mb-6">
                Experience & Expertise
Pandit Vinay Shastri Ji comes from a lineage of Vedic scholars and has been performing religious ceremonies for over 15 years. He has deep knowledge of Vedic scriptures and performs all rituals with precision and devotion.


              </p>
              <p className="text-muted-foreground mb-8">
                Educated in Sanskrit and Vedic literature from Kashi (Varanasi), Pandit Ji ensures that each ceremony is performed according to authentic traditions while adapting to the modern context and requirements of families.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

