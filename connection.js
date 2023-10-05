const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require("@whiskeysockets/baileys")

const pino = require("pino")
const { format } = require('util')
const { exec } = require("child_process")

exports.connectToNetworking = async (start) => {
    const { state, saveCreds } = await useMultiFileAuthState("session");
    const level = pino({ level: "silent"})
    const client = WAConnection({
        logger: level,
        printQRInTerminal: true,
        browser: [ "KAORI", "Firefox", "3.0.0" ],
        syncFullHistory: true,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, level)
        }
    })

    client.ev.on("connection.update", v => {
        const { connection, lastDisconnect } = v
        
        if (connection === "close") {
            if (lastDisconnect.error.output.statusCode !== 401) {
                start()
            } else {
                exec("rm -rf session", (err, stdout, stderr) => {
                    if (err) {
                        console.error("Error al eliminar el archivo de sesión:", err)
                    } else {
                        console.error("Conexión con WhatsApp cerrada. Escanee nuevamente el código QR!")
                        start()
                    }
                })
            }
        } else if (connection === "open") {
            console.log("Kaori esta en red")
        }
    })

    client.ev.on("creds.update", saveCreds)
    return client
}