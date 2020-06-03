import knex from '../database/connection'
import { Request, Response } from 'express'

export class PointsController {
  async create(req: Request, resp: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body

    const trx = await knex.transaction()

    const [point_id] = await trx('points')
      .insert({
        image: 'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
      })
      .returning('id')

    const insertPointItems = items.map((item_id: number) => ({
      point_id,
      item_id
    }))

    await trx('point_items').insert(insertPointItems)

    await trx.commit()

    return resp.json({ id: point_id, ...req.body })
  }

  async show(req: Request, resp: Response) {
    const { id } = req.params

    const point = await knex('points').where({ id }).first()
    if (!point) resp.status(400).json({ message: 'Point not found' })

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', point.id)

    return resp.json({ point, items })
  }

  async index(req: Request, resp: Response) {
    const { city, uf, items } = req.query

    const parsedItems =
      items &&
      String(items)
        .split(',')
        .map((item) => Number(item.trim()))

    const queryRunner = knex('points').join(
      'point_items',
      'points.id',
      '=',
      'point_items.point_id'
    )
    if (parsedItems) queryRunner.whereIn('point_items.item_id', parsedItems)

    if (city) queryRunner.where('city', String(city))

    if (uf) queryRunner.where('uf', String(uf))

    const point = await queryRunner
    if (!point) resp.status(400).json({ message: 'Point not found' })

    return resp.json({ point })
  }
}
