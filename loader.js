exports.load = (client) => {
    client.ev.on("connection.update", async m => {
        if (!m.messages) return
        
        try {
            
            function getMessageType(message) {
                return Object.keys(message)[0];
            }
            
            function getMessageBody(message, type) {
                switch (type) {
                    case "imageMessage":
                    case "videoMessage":
                        return message[type].caption;
                    case "conversation":
                        return message[type];
                    case "extendedTextMessage":
                        return message[type].text;
                    default:
                    return "";
                }
            }
            async function markMessageAsRead(client, messageKey) {
                await client.readMessages([messageKey]);
            }
            
            const v = m.messages[0];
            const from = v.key.remoteJid;
            const sender = v.key.participant || v.key.remoteJid;
            const type = getMessageType(v.message);
            const body = getMessageBody(v.message, type);
            
            await markMessageAsRead(client, v.key);
            
            const sendMessageKaori = body.startsWith
            const kaoriMsg = (jid, content, options) =>  client.sendMessage(jid, content, options);
            
            try {
                switch (true) {
                    case sendMessageKaori("ping"):
                        kaoriMsg(from, {
                            text: `pong`,
                            contextInfo: {
                                mentionedJid: [sender],
                                externalAdReply: {
                                    title: `ᴍᴏᴄʜɪ • ᴛᴀᴋᴜ ᴍᴇᴅɪᴀ`,
                                    body: `0 dias 0 horas 0 minutos 0 segundos`,
                                    showAdAttribution: true,
                                    renderLargerThumbnail: false, 
                                    mediaType: 1, 
                                    thumbnailUrl: 'https://telegra.ph/file/1c2c3f99dc5d010cf5435.jpg'
                                }
                            }
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