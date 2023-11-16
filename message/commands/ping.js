// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Obtener el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        const startTime = Date.now();
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000; // Convertir a segundos
        const formattedResponseTime = responseTime.toFixed(3); // Redondear a 3 decimales
        
        v.reply(m.chat, `Tiempo de respuesta: ${formattedResponseTime} s`, { quoted: m });
    }
};
