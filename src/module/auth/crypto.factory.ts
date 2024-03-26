import CryptoJS from 'crypto-js'
import { env } from '../../core/env'

interface CryptoFactoryInterface {
  comparePassword: (password: string, dPassword: string) => boolean
  decryptedPassword: (password: string) => string
  encryptedPassword: (password: string) => string
}

const SECRET = env.PASS_SECRET

/**
 * Creates a CryptoJS factory instance to provide encryption,
 * decryption and password comparison utilities using AES
 * and the configured secret key.
 */
const CryptoFactory = (): CryptoFactoryInterface => ({
  /**
   * Compares a plaintext password against an encrypted password
   * to check if they match.
   */
  comparePassword: (password, dPassword) =>
    CryptoJS.AES.decrypt(dPassword, SECRET).toString(CryptoJS.enc.Utf8) === password,

  /**
   * Decrypts an encrypted password using the configured secret key.
   */
  decryptedPassword: (password) =>
    CryptoJS.AES.decrypt(password, SECRET).toString(CryptoJS.enc.Utf8),

  /**
   * Encrypts a password using AES encryption and the configured secret key.
   */
  encryptedPassword: (password) => CryptoJS.AES.encrypt(password, SECRET).toString(),
})

export default CryptoFactory
