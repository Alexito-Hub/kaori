module.exports = {
    name: 'promote',
    description: 'Promueve a adminstrador',
    aliases: ['prom', 'promote'],
    
    async execute(sock, m) {
        await sock.sendMessage(m, {
            text: 'promovido',
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: 'hola',
                    body: 'that',
                    showAdAttribution: true,
                    renderLargerThumbnail: false, 
                    mediaType: 1,
                    thumbnailUrl: 'https://telegra.ph/file/1c2c3f99dc5d010cf5435.jpg'
                }
            }
        })
    }
}