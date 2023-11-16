module.exports = {
    name: 'ping',
    description: 'Obten el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        function roundTime(time) {
            return Math.round(time);
        }
        
        const responseMs = Date.now();
        const responseTime = roundTime(responseMs - v.messageTimestamp * 1000);
        const formattedResponseTime = (responseTime / 1000).toFixed(3);
       
        
        v.reply(v, {
            text: `*Tiempo de respuesta:* ${formattedResponseTime} ms`,
            contextInfo: {
                externalAdReply: {
                    title: `Kaori`,
                    body: `${days} dias ${hours} horas ${minutes} minutos ${seconds} segundos`,
                    showAdAttribution: true,
                    renderLargerThumbnail: false, 
                    mediaType: 1, 
                    thumbnailUrl: 'https://telegra.ph/file/1c2c3f99dc5d010cf5435.jpg'
                }
            }
        }, { quoted: q})
    }
}