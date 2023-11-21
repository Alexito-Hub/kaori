import('lowdb/node')

const configData = {
  posts: []
}

const db = await JSONPreset('db.json', configData)


await db.write()
