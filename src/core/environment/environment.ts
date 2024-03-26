import * as dotenv from 'dotenv'
import { z } from 'zod'
import { CONSTANT } from '../constant'

dotenv.config({
  path: '.env',
})

const envSchema = z.object({
  NODE_ENV: z.enum([CONSTANT.DEVELOPMENT, CONSTANT.PRODUCTION,CONSTANT.TEST]).default(CONSTANT.DEVELOPMENT),
  PORT: z.string(),
  DATABASE_URL: z.string().url(CONSTANT.INVALID_DATABASE_URL),
  BASE_URL: z.string().url( CONSTANT.INVALID_BASE_URL),
  PASS_SECRET: z.string(),
  JWT_ACCESS_EXPIRATION_MINUTES: z.string(),
  JWT_REFRESH_EXPIRATION_DAYS: z.string(),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USERNAME: z.string(),
  SMTP_PASSWORD: z.string(),
  EMAIL_FROM: z.string(),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  REDIRECT_URI: z.string(),
})
export const env = envSchema.parse(process.env) as z.infer<typeof envSchema>
