module.export = {
    name: 'time',
    description: 'Muestra el tiempo de actividad',
    aliases: ['time', 'run'],
    
    async execute(sock, m, formattedTime) {
        await v.reply(`*[ ${formattedTime} ]*`)
    }
}