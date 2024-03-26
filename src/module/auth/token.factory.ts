import jwt from 'jsonwebtoken'
// @ts-ignore
import moment, { Moment } from 'moment'
import { env } from '../../core'
import { tokenTypes } from '../../core/constant'
 
 

interface TokenPayload {
  exp: number
  iat: number
  role: string
  userId: string
  type: string
}

type Payload = (id: string, role: string, expires: Moment, type: string) => TokenPayload

interface TokenFactory {
  accessExpire: Moment
  generate: (id: string, role: string, expires: Moment, type: string) => string
  refreshExpire: Moment
  verify: (token: string) => TokenPayload
}

/**
 * Payload is a function that returns a TokenPayload object
 * based on the provided id, role, expires and type parameters.
 *
 * It is used to generate the payload for JWT tokens in the TokenFactory.
 */
const payload: Payload = (id, role, expires, type) => ({
  exp: expires.unix(),
  iat: moment().unix(),
  role,
  userId: id,
  type,
})

const SECRET: string = env.JWT_SECRET!
const ACCESS_EXPIRATION: string = env.JWT_ACCESS_EXPIRATION_MINUTES!
const REFRESH_EXPIRATION: string = env.JWT_REFRESH_EXPIRATION_DAYS!

/**
 * TokenFactory returns an object implementing the TokenFactory interface.
 * It contains methods for generating and verifying JWT tokens
 * with different expiration times.
 */

const TokenFactory = (): TokenFactory => ({
  /**
   * The accessExpire sets the expiration for access tokens.
   * It is calculated by adding the ACCESS_EXPIRATION duration (in minutes)
   * to the current moment.
   */
  accessExpire: moment().add(ACCESS_EXPIRATION, 'minutes'),
  /**
   * The generate creates a signed JWT token using the provided payload.
   * It signs the token using the application secret and returns
   * the generated token string.
   */
  generate: (id, role, expires, type) => jwt.sign(payload(id, role, expires, type), SECRET),
  /**
   * The refreshExpire sets the expiration for refresh tokens.
   * It is calculated by adding the REFRESH_EXPIRATION duration (in days)
   * to the current moment.
   */
  refreshExpire: moment().add(REFRESH_EXPIRATION, 'days'),
  /**
   * Verifies the provided JWT token using the secret from the environment.
   * Returns the decoded token payload if valid.
   * Throws an error if the token is invalid.
   */
  verify: (token) => jwt.verify(token, SECRET) as TokenPayload,
})

export default TokenFactory

export const generateAuthTokens = async (id: string, role: string) => {
  return {
    access: {
      expires: TokenFactory().accessExpire.toDate(),
      token: TokenFactory().generate(id, role, TokenFactory().accessExpire, tokenTypes.ACCESS),
    },
    refresh: {
      expires: TokenFactory().refreshExpire.toDate(),
      token: TokenFactory().generate(id, role, TokenFactory().refreshExpire, tokenTypes.REFRESH),
    },
  }
}

export const verifyToken = (token: string) => TokenFactory().verify(token.split(' ')[1])

export const generateRegisterVerificationTokens = async (id: string, role: string) => {
  return {
    access: {
      expires: TokenFactory().accessExpire.toDate(),
      token: TokenFactory().generate(
        id,
        role,
        TokenFactory().accessExpire,
        tokenTypes.VERIFY_EMAIL,
      ),
    },
  }
}

export const generateForgotVerificationToken = async (id: string, role: string) => {
  return {
    access: {
      expires: TokenFactory().accessExpire.toDate(),
      token: TokenFactory().generate(
        id,
        role,
        TokenFactory().accessExpire,
        tokenTypes.RESET_PASSWORD,
      ),
    },
  }
}
