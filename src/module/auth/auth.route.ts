import { Router } from 'express'
// import { routeLogger } from '../../core/logRoute'
import {
  forgotPassword,
  registerTokenValidate,
  resetPassword,
  signIn,
  signInGoogleCallbackController,
  signInGoogleController,
  signUp,
  verifyResetPassword,
} from './auth.controller'

const authRouter = Router()

authRouter.post('/sign-up', signUp)
authRouter.post('/sign-in', signIn)
authRouter.get('/sign-out')
authRouter.get('/verify-email', registerTokenValidate)
authRouter.post('/forgot-password', forgotPassword)
authRouter.post('/reset-password', resetPassword)
authRouter.get('/verify-reset-password', verifyResetPassword)
authRouter.get('/google', signInGoogleController)
authRouter.get('/api/google/callback', signInGoogleCallbackController)

// authRouter.use(routeLogger)

export default authRouter
