import { Router } from 'express'

import { create, deleteById, getAll, getById, updateById } from './church.controller'
import { ROUTE } from '../../core/constant'

const churchRoute = Router()

churchRoute.route(ROUTE.ROOT).get(getAll).post(create)

churchRoute.route(ROUTE.ID).get(getById).put(updateById).delete(deleteById)

export default churchRoute
