module.exports = {
    name: 'ping',
    description: 'Obten el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        const uptime = process.uptime();
        
        const days = Math.floor(uptime / (24 * 60 * 60));
        const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptime % (60 * 60)) / 60);
        const seconds = Math.floor(uptime % 60);
        
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
                    thumbnailUrl: 'https://telegra.ph/file/ae78c6675b0f413a5c635.jpg'
                }
            }
        }, { quoted: m})
    }
}