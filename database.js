import { Low, JSONFile } from 'lowdb'

type Data = {
  config: { prefixes: string, owner: string, staff: string }[]
}

const configDataDb = new JSONFile<Data>('db.json', { config: [] })
const db = new Low(configDataDb)

await db.read()

module.exports = db;