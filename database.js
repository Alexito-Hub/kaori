const { Low, JSONFile } = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

type Data = {
  config: { prefixes: string, owner: string, staff: string }[]
}

const configDataDb = new JSONFile<Data>('db.json', { config: [] })
const db = new Low(configDataDb)

await db.read()

module.exports = db;