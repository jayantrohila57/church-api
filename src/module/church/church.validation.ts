import { z } from 'zod'

// Church model
const ChurchSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.number(),
  socialMediaProfile: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  events: z.array(z.string()).optional(),
  createdById: z.string(),
})

const CreateChurchSchema = ChurchSchema.pick({ name: true, zipCode: true, createdById: true })
const UpdateChurchSchema = ChurchSchema.partial()

type Church = z.infer<typeof ChurchSchema>

export { CreateChurchSchema, UpdateChurchSchema, Church }
