module.export = {
    name: 'time',
    description: 'Muestra el tiempo de actividad',
    aliases: ['time', 'run'],
    
    async execute(sock, m) {
        await sock.sendMessage(m.chat, {
            text: 'time',
        }, {quoted: m})
    }
}