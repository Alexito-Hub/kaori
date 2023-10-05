const { connectToNetworking } = require("./connection")
const { load } = require("./loader")

async function start() {
    try {
        const kaori = await connectToNetworking(start)
        load(kaori)
    } catch (error) {
        console.error("Error al iniciar el bot:", error)
    }
}

start()