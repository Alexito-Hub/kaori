// commands/test.js

module.exports = {
  name: 'test',
  aliases: ['testing', 'test'],
  description: 'Comando de prueba',

  async execute(sock, m, args) {
    await sock.sendMessage(m.chat, {
        text: ''
        
    })
  },
};
