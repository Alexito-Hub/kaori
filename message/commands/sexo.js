module.exports = {
    name: 'sexo',
    description: 'sexooooooo',
    aliases: ['sexo', 'sex'],
    
    async execute( sock, m) {
        await sock.sendMessage(m.chat, {
            text: 'sexooooooooo'
        })
    }
}




