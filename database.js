import('lowdb/node')

const configData = {
  posts: []
}

const db = async (sock) => await JSONPreset('db.json', configData)


async (sock) => await db.write()

module.exports = db;