import winston from 'winston'
import { LOGGER } from '../constant'

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: LOGGER.LOG_DATE }),
  winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`
  }),
)

export const logger = winston.createLogger({
  level: LOGGER.LOG_LEVEL,
  format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: LOGGER.LOG_FILE_NAME }),
  ],
})
