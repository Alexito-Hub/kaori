module.exports = {
    name: 'menu',
    description: 'Obtiene la lista de comandos disponibles',
    aliases: ['menu', 'main'],
    
    async execute(sock, m, args) {
        v.reply('esto es el menu')
    }
}