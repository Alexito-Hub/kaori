// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Obtener el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        const startTime = Date.now();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        const formattedResponseTime = responseTime.toFixed(3);
        
        v.reply(`Tiempo de respuesta: ${formattedResponseTime} ms`, { quoted: m });
    }
};
