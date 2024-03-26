import { Request, Response } from 'express'
import { Responses, TC, db } from '../../core'
import { MESSAGES } from '../../core/constant'

export const getAll = TC(async (_req: Request, res: Response) => {
  const users = await db.user.findMany()
  if (users.length > 0) Responses(res, MESSAGES.USER.SUCCESS.READ, users, [])
  if (users.length < 0) Responses(res, MESSAGES.USER.DATA_LENGTH_ERROR, users, [])
})

export const create = TC(async (req: Request, res: Response) => {
  const isUser = await db.user.findFirst({ where: { email: req.body.email } })
  if (isUser) return Responses(res, MESSAGES.USERS_ALREADY_EXIST)
  const newUser = await db.user.create({ data: { ...req.body } })
  Responses(res, MESSAGES.USER_FETCH_SUCCESSFULLY, newUser)
})

export const getById = TC(async (req: Request, res: Response) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } })
  if (user) Responses(res, MESSAGES.USER_FETCH_SUCCESSFULLY, user)
  if (!user) Responses(res, MESSAGES.USER_NOT_FOUND)
})

export const deleteById = TC(async (req: Request, res: Response) => {
  const user = await db.user.delete({ where: { id: req.params.id } })
  if (user) Responses(res, MESSAGES.USER.SUCCESS.DELETE, user)
  if (!user) Responses(res, MESSAGES.USER.ERROR.DELETE)
})

export const updateById = TC(async (req: Request, res: Response) => {
  const isUser = await db.user.findFirst({ where: { email: req.body.email } })
  if (!isUser) Responses(res, MESSAGES.USER.)
  if (isUser && isUser.email != req.body.email) Responses(res, MESSAGES.CANNOT_CHANGE_EMAIL)
  const user = await db.user.update({
    where: { id: req.params.id },
    data: req.body,
  })
  if (user) Responses(res, MESSAGES.USER_UPDATED_SUCCESSFULLY, user)
})
