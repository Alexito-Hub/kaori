;( async () => {
    const JSONPreset = await import("lowdb/node")
    const fs = require('fs')
    const path = require('path');
    
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
})