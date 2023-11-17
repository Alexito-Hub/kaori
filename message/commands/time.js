module.export = {
    name: 'time',
    description: 'Muestra el tiempo de actividad',
    aliases: ['time', 'run'],
    
    async execute(sock, m, formattedTimeShort) {
        await v.reply(`*[ ${formattedTimeShort} ]*`)
    }
}