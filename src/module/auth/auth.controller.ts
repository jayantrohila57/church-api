import axios from 'axios'
import { Request, Response } from 'express'
import db from '../../core/db'
import { env } from '../../core/env'
import reqValidate from '../../core/reqValidate'
import { Responses } from '../../core/response'
import TC from '../../core/trycatch'
import { sendResetPasswordEmail, sendSuccessfulRegistration } from '../email/email.services'
import AuthValidation from './auth.validation'
import CryptoFactory from './crypto.factory'
import {
  generateAuthTokens,
  generateForgotVerificationToken,
  generateRegisterVerificationTokens,
  tokenTypes,
  verifyToken,
} from './token.factory'

const { comparePassword, encryptedPassword } = CryptoFactory()

// Exporting the signUp function using tryCatch to handle asynchronous operations and errors
export const signUp = TC(async (req: Request, res: Response) => {
  // Validate the incoming request body using the signUp validation schema
  const validate = await reqValidate(req, AuthValidation.signUp)

  // If validation fails, return an error response
  if (!validate.status) return Responses(res, validate.message[0], {}, {})

  // Extract necessary data from the validated request body
  const payload: any = validate.body?.data
  const { email, password, name } = payload

  // Check if a user with the provided email already exists
  const user = await db.user.findUnique({ where: { email } })

  // If user already exists, return an error response
  if (user) return Responses(res, 'User already exists, Use different email')

  // Create a new user with provided details and encrypt the password
  const newUser = await db.user.create({
    data: {
      email,
      name,
      auth: { create: { email, password: encryptedPassword(password) } },
    },
    include: { auth: true },
  })

  // Generate a verification token for the newly registered user
  const token = generateRegisterVerificationTokens(newUser.id, newUser.role)

  // Update the authentication entry with the verification token
  await db.auth.update({
    where: { id: newUser.authId! },
    data: {
      token: {
        verifyEmail: { token: (await token).access.token, expireAt: (await token).access.expires },
      },
    },
  })

  // Send a successful registration email to the user
  await sendSuccessfulRegistration(email, (await token).access.token, newUser.name)

  // Return a success response
  return Responses(res, 'Sign-up Successfully, Please check your E-mail')
})

// Exporting the signIn function using tryCatch to handle asynchronous operations and errors
export const signIn = TC(async (req: Request, res: Response) => {
  // Validate the incoming request body using the signIn validation schema
  const validate = await reqValidate(req, AuthValidation.signIn)

  // If validation fails, return an error response
  if (!validate.status) return Responses(res, validate.message[0], {}, {})

  // Extract necessary data from the validated request body
  const payload: any = validate.body?.data
  const { email, password } = payload

  // Find the user by email, including the associated authentication data
  const user = await db.user.findUnique({
    where: { email, auth: { email } },
    include: { auth: true },
  })

  // If user not found, return an error response
  if (!user) return Responses(res, 'No User Found with this Email')

  // Retrieve the user's password from the authentication data
  const userPassword = user.auth?.password

  // Compare the provided password with the stored password
  if (comparePassword(password, userPassword as string)) {
    // Generate authentication tokens for the user
    const token = await generateAuthTokens(user.id, user.role)

    // Update the authentication entry with the generated tokens
    const updateAuth = await db.auth.update({
      where: { id: user.authId! },
      data: {
        token: {
          access: { token: token.access.token, expireAt: token.access.expires },
          refresh: { token: token.refresh.token, expireAt: token.refresh.expires },
        },
      },
    })

    // Return a success response along with user data and updated authentication details
    return Responses(res, 'Sign-in Successfully', { user, updateAuth })
  }

  // If password does not match, return an error response
  return Responses(res, 'Invalid Email or Password')
})

export const registerTokenValidate = TC(async (req: Request, res: Response) => {
  // Received token from frontend
  const verifiedToken = verifyToken(`token ${req.query.token as string}`)

  // Extract userId from the verified token
  if (verifiedToken.type !== tokenTypes.VERIFY_EMAIL) return Responses(res, 'Invalid token ')

  // Get user information from the database including authentication details based on userId
  const user = await db.user.findUnique({
    include: { auth: true },
    where: { id: verifiedToken.userId },
  })

  // Extract the verification token from the user's authentication information
  const authToken = user?.auth?.token[0]?.verifyEmail?.token!

  // Compare the received token and the extracted authentication token
  if (authToken && req.query.token) {
    if ((req.query.token as string) !== authToken) return Responses(res, 'Invalid token ')

    // Update user information and set email verification status to true
    await db.user.update({
      where: { email: user.email, id: user.id, authId: user.authId! },
      data: {
        isEmailVerified: true,
        auth: {
          update: {
            data: {
              token: {
                verifyEmail: null,
              },
            },
          },
        },
      },
    })

    // Return success message indicating that the account has been successfully verified
    return Responses(res, 'Account Successfully Verified, you can Login now ')
  }
})

export const forgotPassword = TC(async (req: Request, res: Response) => {
  // Validate the incoming request body using the signIn validation schema
  const validate = await reqValidate(req, AuthValidation.forgotPassword)

  // If validation fails, return an error response
  if (!validate.status) return Responses(res, validate.message[0], {}, {})

  const user = await db.user.findFirst({
    where: {
      email: req.body.email,
    },
  })
  console.log(user)
  // Check if no user is found with the provided email and return an error message
  if (!user) return Responses(res, 'No user found with this email')

  // Generate a verification token for password reset based on user id and role
  const token = generateForgotVerificationToken(user.id, user.role)

  // Update the user's authentication information in the database with the generated token
  await db.auth.update({
    where: { id: user.authId! },
    data: {
      token: {
        resetPassword: {
          token: (await token).access.token,
          expireAt: (await token).access.expires,
        },
      },
    },
  })

  // Send a password reset email to the user's email address with the generated token
  await sendResetPasswordEmail(user.email, (await token).access.token)

  // Return a success message indicating that the password reset link has been sent to the user's email
  return Responses(res, 'Password Reset link sent to your email')
})

export const resetPassword = TC(async (req: Request, res: Response) => {
  // Destructure email, password, and newPassword from the request body
  const { email, password, newPassword } = req.body

  // Retrieve user information from the database based on email and auth email
  const user = await db.user.findUnique({
    where: { email, auth: { email } },
    include: { auth: true },
  })

  // Check if user does not exist and return an error message
  if (!user) return Responses(res, 'No User Found with this Email')

  // Check if the provided password matches the stored password for the user
  if (comparePassword(password, user.auth?.password as string)) {
    // Check if the old and new passwords are the same
    if (comparePassword(password, encryptedPassword(newPassword)))
      return Responses(res, 'Old and New Password cannot be the same')

    // Update the user's password in the database with the new encrypted password
    await db.auth.update({
      where: { id: user.authId! },
      data: {
        password: encryptedPassword(newPassword),
      },
    })

    // Return success message if the password reset is successful
    return Responses(res, 'Password reset Successfully')
  }

  // Return error message if the provided email or password is invalid
  return Responses(res, 'Invalid Email or Password')
})

export const verifyResetPassword = TC(async (req: Request, res: Response) => {
  // Destructure token and newPassword from the request query parameters
  const { token, newPassword } = req.query

  // Verify the received token
  const verifiedToken = verifyToken(`token ${token as string}`)

  // Check if the token type is not RESET_PASSWORD and return an error message
  if (verifiedToken.type !== tokenTypes.RESET_PASSWORD) return Responses(res, 'Invalid token ')

  // Get user information from the database including authentication details based on userId
  const user = await db.user.findUnique({
    include: { auth: true },
    where: { id: verifiedToken.userId },
  })

  // Extract the reset password token from the user's authentication information
  const authToken = user?.auth?.token[0]?.resetPassword?.token!

  // Compare the received token and the extracted reset password token
  if (authToken && req.query.token) {
    if ((req.query.token as string) !== authToken) return Responses(res, 'Invalid token ')

    // Update user information, remove the reset password token, and set the new encrypted password
    await db.user.update({
      where: { email: user.email, id: user.id, authId: user.authId! },
      data: {
        auth: {
          update: {
            data: {
              token: {
                resetPassword: null,
              },
              password: encryptedPassword(newPassword as string),
            },
          },
        },
      },
    })

    // Return success message indicating that the password has been reset successfully
    return Responses(res, 'Password reset Successfully, you can Login now ')
  }
})

export const signInGoogleController = TC(async (req: Request, res: Response) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.CLIENT_ID}&redirect_uri=${env.REDIRECT_URI}&response_type=code&scope=profile email`
  res.redirect(url)
})

export const signInGoogleCallbackController = TC(async (req: Request, res: Response) => {
  const { code } = req.query

  // Exchange authorization code for access token
  const { data } = await axios.post('<https://oauth2.googleapis.com/token>', {
    client_id: env.CLIENT_ID,
    client_secret: env.CLIENT_SECRET,
    code,
    redirect_uri: env.REDIRECT_URI,
    grant_type: 'authorization_code',
  })

  const { access_token, id_token } = data

  // Use access_token or id_token to fetch user profile
  const { data: profile } = await axios.get('<https://www.googleapis.com/oauth2/v1/userinfo>', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  // Code to handle user authentication and retrieval using the profile data

  res.send({ data, profile })
})
