const {
     default: WAConnection,
     useMultiFileAuthState,
     generateWAMessageFromContent,
     makeCacheableSignalKeyStore
 } = require("@whiskeysockets/baileys")

exports.load = (client) => {
    client.ev.on("connection.update", async m => {
        if (!m.messages) return
        
        try {
            const v = m.messages[0]
            const from = v.key.remoteJid
            const sender = (v.key.participant || v.key.remoteJid)
            const type = Object.keys(v.message)[0]
            const body =
              (type == 'imageMessage' || type == 'videoMessage') ? v.message[type].caption :
              (type == 'conversation') ? v.message[type] :
              (type == 'extendedTextMessage') ? v.message[type].text : ''
            await client.readMessages([v.key])
            
            const kaoriMsg = (jid, content, options) =>  client.sendMessage(jid, content, options);
            
            try {
                switch (true) {
                    case body.startsWith("ping"):
                        await client.sendMessage(from, {
                            text: `pong`
                        })
                    break
                }
            } catch (e) {
                console.log("error de comandos")
            }
            
        } catch (error) {
            if (error.name === "ConnectionError") {
                console.log("Error de conexión:", error)
                start()
            }
        }
    })
}