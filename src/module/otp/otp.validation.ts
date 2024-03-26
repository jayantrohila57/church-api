import { z } from 'zod'

// Otp model
const OtpSchema = z.object({
  userId: z.string(),
  type: z.enum(['RESET', 'VERIFY', 'FORGOT']),
  code: z.number(),
})

const CreateOtpSchema = OtpSchema.pick({ userId: true, type: true, code: true })
const UpdateOtpSchema = OtpSchema.partial()

type Otp = z.infer<typeof OtpSchema>

export { CreateOtpSchema, UpdateOtpSchema, Otp }
