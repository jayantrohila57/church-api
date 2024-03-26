import { z } from 'zod'

const AuthValidation = {
  signUp: {
    body: z.object({
      email: z.string(),
      name: z.string().optional(),
      password: z.string().min(8),
      phone: z.number().optional(),
    }),
    query: z.object({}),
    params: z.object({}),
  },
  signIn: {
    body: z.object({
      email: z.string(),
      password: z.string().min(8),
    }),
    query: z.object({}),
    params: z.object({}),
  },
  resetPassword: {
    body: z.object({
      newPassword: z.string().min(8),
      password: z.string().min(8),
    }),
    query: z.object({}),
    params: z.object({}),
  },
  forgotPassword: {
    body: z.object({
      email: z.string(),
    }),
    query: z.object({}),
    params: z.object({}),
  },
}

export default AuthValidation
