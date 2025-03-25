"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What services does Pandit Ji offer?",
    answer:
      "Pandit Ji offers a wide range of traditional Hindu rituals and ceremonies including but not limited to: Griha Pravesh (house warming), Vivah (wedding ceremonies), Satyanarayan Katha, Mundan ceremony, Navagraha Shanti, and various types of Havan/Homa rituals. He can also provide guidance on auspicious dates and times for ceremonies.",
  },
  {
    question: "How far in advance should I book for a ceremony?",
    answer:
      "For major ceremonies like weddings, it's recommended to book at least 2-3 months in advance to ensure availability. For smaller ceremonies, 2-3 weeks notice is generally sufficient, but booking earlier is always better to secure your preferred date and time.",
  },
  {
    question: "What items do I need to arrange for the ceremony?",
    answer:
      "Once you book a ceremony, Pandit Ji will provide you with a detailed list of items (samagri) required for the specific ritual. For convenience, we also offer samagri kits that contain all necessary items for common ceremonies, which you can purchase directly from us.",
  },
  {
    question: "Does Pandit Ji travel to different locations?",
    answer:
      "Yes, Pandit Ji is available to travel within the city and to nearby areas for ceremonies. For locations further away, additional travel charges may apply. Please mention your location when booking to get accurate information.",
  },
  {
    question: "How long do the ceremonies typically last?",
    answer:
      "The duration varies depending on the type of ceremony. Simple pujas may take 1-2 hours, while elaborate ceremonies like weddings can take 3-4 hours or more. Pandit Ji will provide you with an estimated timeline when you book the service.",
  },
  {
    question: "Does Pandit Ji perform ceremonies in English?",
    answer:
      "While the mantras are recited in Sanskrit as per tradition, Pandit Ji provides explanations and instructions in Hindi and English to ensure all participants understand the significance of the rituals being performed.",
  },
  {
    question: "Can we customize the ceremony according to our family traditions?",
    answer:
      "Yes, Pandit Ji respects regional and family variations in rituals. During the booking process, you can discuss any specific traditions or customs you would like to incorporate, and Pandit Ji will accommodate them whenever possible.",
  },
]

export default function Faq() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-16 md:py-24" id="faqs">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about our services and ceremonies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

