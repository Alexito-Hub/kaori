import('lowdb/node')

const configData = {
    config: {
        prefixes: ['#'],
        owner: ['51968374620'],
        staff:[]
    }
}


const db = async (sock) =>  await JSONPreset('db.json', configData)
async (sock) => await db.write()

module.exports = db;