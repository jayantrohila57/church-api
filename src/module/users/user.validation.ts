import { z } from 'zod'

// User model
const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  isEmailVerified: z.boolean(),
  phoneNumber: z.number().optional(),
  biography: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']),
  dateOfBirth: z.date().optional(),
  preferredLanguage: z.string().optional(),
  events: z.array(z.string()).optional(),
  churches: z.array(z.string()).optional(),
  profileImageUrl: z.string().optional(),
  passwordHash: z.string(),
  otps: z.array(z.string()).optional(),
})

const CreateUserSchema = UserSchema.pick({ name: true, email: true, passwordHash: true })
const UpdateUserSchema = UserSchema.partial()

type User = z.infer<typeof UserSchema>

export { CreateUserSchema, UpdateUserSchema, User }
