import knex from '../database/connection'
import { Request, Response } from 'express'

export class ItemsController {
  async index(req: Request, resp: Response) {
    const items = await knex('items').select('*')

    const sereliazedItems = items.map((item) => {
      return {
        ...item,
        imageUrl: `http://localhost:3000/uploads/${item.image}`
      }
    })

    return resp.json(sereliazedItems)
  }
}
