import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import { TC } from '../../core'

const prisma = new PrismaClient()

export const getAllEvents = TC(async (_req: Request, res: Response) =>
  res.send(await prisma.event.findMany()),
)

export const createEvent = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.event.create({
      data: req.body,
    }),
  ),
)

export const getEventById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.event.findUnique({
      where: { id: req.params.id },
    }),
  ),
)
export const deleteEventById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.event.delete({
      where: { id: req.params.id },
    }),
  ),
)

export const updateEventById = TC(async (req: Request, res: Response) =>
  res.send(
    await prisma.event.update({
      where: { id: req.params.id },
      data: req.body,
    }),
  ),
)
