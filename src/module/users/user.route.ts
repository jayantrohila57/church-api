import { Router } from 'express'
import { create, deleteById, getAll, getById, updateById } from './user.controller'
import { ROUTE } from '../../core/constant'
import { validate } from '../../middleware/validate'
import { CreateUserSchema, UpdateUserSchema } from './user.validation'

const userRoute = Router()

userRoute.route(ROUTE.ROOT).get(getAll).post(validate(CreateUserSchema), create)

userRoute
  .route(ROUTE.ID)
  .get(getById)
  .patch(validate(UpdateUserSchema), updateById)
  .delete(deleteById)

export default userRoute
