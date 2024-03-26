import express, { Application } from 'express'
import { env, logger } from './core'
import { churchRoute, docsRoute, userRoute } from './module'
import { CONSTANT, ROUTE } from './core/constant'

const app: Application = express()
const PORT = env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(ROUTE.CHURCH, churchRoute)
app.use(ROUTE.DOCS, docsRoute)
app.use(ROUTE.USERS, userRoute)

app.listen(PORT, () => {
  try {
    logger.info(CONSTANT.SERVER_RUNNING + PORT, CONSTANT.SUCCESS)
  } catch (error) {
    logger.error(CONSTANT.SERVER_ERROR, error)
  }
})

process.on(CONSTANT.UNHANDLED_REJECTION, (reason, promise) => {
  logger.error(CONSTANT.UNHANDLED_REJECTION, promise, CONSTANT.REASON, reason)
  process.exit(1)
})
