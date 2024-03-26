import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { TC } from '../../core'

const prisma = new PrismaClient()

export const getAll = TC(async (_req: Request, res: Response) =>
  res.send(await prisma.church.findMany()),
)

export const create = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.church.create({
      data: req.body,
    }),
  ),
)

export const getById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.church.findUnique({
      where: { id: req.params.id },
    }),
  ),
)
export const deleteById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.church.delete({
      where: { id: req.params.id },
    }),
  ),
)

export const updateById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.church.update({
      where: { id: req.params.id },
      data: req.body,
    }),
  ),
)
