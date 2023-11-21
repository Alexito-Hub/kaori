const { Low, JSONFile } = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new JSONFile('db.json', { users: [] })

const db = new Low(configDataDb)

await db.read()

module.exports = db;