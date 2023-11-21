const { Low, JSONFile } = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

type configData = {
  config: { prefixes: string, owner: string, staff: string }[]
}

const configDataDb = new JSONFile<configData>('db.json', { config: [] })
const db = new Low(configDataDb)

await db.read()

module.exports = db;