// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Obtener el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        const startTime = Date.now();
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        v.reply(`Tiempo de respuesta: ${responseTime} ms`, { quoted: m });
    }
};
