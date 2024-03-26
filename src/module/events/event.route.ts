import { Router } from 'express'

import tokenValidate from '../../core/token.validate'
import {
  createEvent,
  deleteEventById,
  getAllEvents,
  getEventById,
  updateEventById,
} from './event.controller'

const eventRoute = Router()

eventRoute.get('/', getAllEvents)
eventRoute.get('/:id', getEventById)
eventRoute.post('/', createEvent)
eventRoute.delete('/:id', tokenValidate, deleteEventById)
eventRoute.put('/:id', updateEventById)

export default eventRoute
