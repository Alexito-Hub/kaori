// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Obtener el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        console.log('Comando de ping ejecutado');
        
        function roundTime(time) {
            return Math.round(time);
        }
        
        const responseMs = Date.now();
        const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
        const formattedResponseTime = (responseTime / 1000).toFixed(3);

        await v.reply(`Tiempo de respuesta: ${formattedResponseTime} s`, { quoted: m });
    }
};
