import { z } from 'zod'

// Event model
const EventSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  eventDate: z.date(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  churchId: z.string(),
  createdById: z.string(),
})

const CreateEventSchema = EventSchema.pick({
  name: true,
  eventDate: true,
  churchId: true,
  createdById: true,
})
const UpdateEventSchema = EventSchema.partial()

type Event = z.infer<typeof EventSchema>

export { CreateEventSchema, UpdateEventSchema, Event }
