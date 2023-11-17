module.export = {
    name: 'time',
    description: 'Muestra el tiempo de actividad',
    aliases: ['time', 'run'],
    
    async execute(sock, m) {
        const formattedTime = `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
        await v.reply(`*[ ${formattedTime} ]*`)
    }
}