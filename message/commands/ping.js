module.exports = {
    name: 'ping',
    description: 'Obten el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        
        
        v.reply(v, {
            text: `*Tiempo de respuesta:* ${formattedResponseTime} ms`,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: `ᴍᴏᴄʜɪ • ᴛᴀᴋᴜ ᴍᴇᴅɪᴀ`,
                    body: `${days} dias ${hours} horas ${minutes} minutos ${seconds} segunfos`,
                    showAdAttribution: true,
                    renderLargerThumbnail: false, 
                    mediaType: 1, 
                    thumbnailUrl: 'https://telegra.ph/file/1c2c3f99dc5d010cf5435.jpg'
                }
            }
        })
    }
}