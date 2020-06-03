import knex from 'knex'
import path from 'path'

const connection = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    database: 'database_db'
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations')
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds')
  },
  useNullAsDefault: true
})

export default connection
