import('lowdb/node')

const configData = {
    config: {
        prefixes: ['#'],
        owner: ['51968374620'],
        staff:[]
    }
}

async (sock) => {
    const db = await JSONPreset('db.json', configData)
    await db.write()
}

module.exports = db;