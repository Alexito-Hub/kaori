const { JSONPreset } = require('lowdb/node')

const configData = {
  posts: []
}

const db = await JSONPreset('db.json', configData)

db.data.posts.push({ id: 1, title: 'lowdb es genial' })

await db.write()
