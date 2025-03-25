"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "RS",
    location: "Delhi",
    rating: 5,
    text: "Pandit Ji performed our daughter's wedding ceremony with such devotion and precision. His knowledge of rituals and clear explanations made the ceremony meaningful for everyone present.",
  },
  {
    id: 2,
    name: "Priya Patel",
    avatar: "PP",
    location: "Mumbai",
    rating: 5,
    text: "We had Pandit Ji conduct our house warming ceremony. His positive energy and thorough knowledge of Vastu principles helped us feel confident about our new home. Highly recommended!",
  },
  {
    id: 3,
    name: "Amit Singh",
    avatar: "AS",
    location: "Bangalore",
    rating: 5,
    text: "The Satyanarayan Katha performed by Pandit Ji was beautiful and spiritually uplifting. He explained the significance of each ritual which made it more meaningful for our family.",
  },
  {
    id: 4,
    name: "Sunita Gupta",
    avatar: "SG",
    location: "Jaipur",
    rating: 5,
    text: "Pandit Ji conducted our son's thread ceremony. His patience with children and detailed knowledge of the traditions made the event perfect. We're grateful for his services.",
  },
]

export default function Reviews() {
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
    <section className="py-16 md:py-24 bg-muted/30" id="reviews">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Client Testimonials</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from families who have experienced the sacred ceremonies performed by Pandit Ji.
          </p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {reviews.map((review) => (
            <motion.div key={review.id} variants={itemVariants}>
              <Card className="h-full">
                <CardContent className="pt-6">
                  <div className="flex mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{review.text}"</p>
                </CardContent>
                <CardFooter>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src="" alt={review.name} />
                      <AvatarFallback>{review.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.location}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

