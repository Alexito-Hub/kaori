module.exports = {
    name: 'ping',
    description: 'Obtener el tiempo de respuesta',
    aliases: ['ping', 'ms'],
    
    async execute(sock, m, args) {
        function roundTime(time) {
            return Math.round(time);
        }
        
        const responseMs = Date.now();
        const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
        const formattedResponseTime = (responseTime / 1000).toFixed(3);

        sock.sendMessage(m.chat, {text:`${formattedResponseTime} ms`}, {quoted:m});
    }
};
