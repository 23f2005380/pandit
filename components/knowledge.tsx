"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const knowledgeContent = [
  {
    id: "vedas",
    title: "The Vedas",
    content:
      "The Vedas are the oldest scriptures of Hinduism. They are a large body of religious texts originating in ancient India, composed in Vedic Sanskrit, and among the oldest scriptures of Hinduism. There are four Vedas: the Rigveda, the Yajurveda, the Samaveda and the Atharvaveda. Each Veda has four subdivisions – the Samhitas (mantras and benedictions), the Aranyakas (text on rituals, ceremonies, sacrifices and symbolic-sacrifices), the Brahmanas (commentaries on rituals, ceremonies and sacrifices), and the Upanishads (texts discussing meditation, philosophy and spiritual knowledge).",
  },
  {
    id: "poojas",
    title: "Importance of Poojas",
    content:
      "Poojas are devotional worship rituals performed by Hindus to honor, celebrate, and spiritually connect with deities. These ceremonies involve offerings, prayers, and specific rituals that vary based on the deity and occasion. Poojas create a sacred space for divine connection, express gratitude, seek blessings, and maintain cultural traditions. They can be performed daily at home or for special occasions like weddings and housewarmings. The rituals typically include preparation, invocation, offerings, and concluding prayers, all designed to purify the environment and establish a spiritual connection.",
  },
  {
    id: "mantras",
    title: "Power of Mantras",
    content:
      "Mantras are sacred sounds, words, or phrases in Sanskrit that are repeated during meditation or rituals. They are believed to have spiritual and psychological benefits. The repetition of mantras helps focus the mind, creates positive vibrations, and connects the practitioner with divine energies. Different mantras serve different purposes - some invoke specific deities, others promote healing, protection, or spiritual growth. The sound vibrations of mantras are considered as important as their meaning, creating resonance that affects consciousness and energy. Regular practice of mantra recitation (japa) is an integral part of spiritual discipline in Hinduism.",
  },
]

export default function Knowledge() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24" id="knowledge">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Spiritual Knowledge</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore the ancient wisdom and spiritual knowledge from Vedic traditions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="vedas" className="max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3">
              {knowledgeContent.map((item) => (
                <TabsTrigger key={item.id} value={item.id}>
                  {item.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {knowledgeContent.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>Ancient wisdom from Vedic traditions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.content}</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}

