// commands/test.js

module.exports = {
  name: 'test',
  aliases: ['testing'],
  description: 'Comando de prueba',

  async execute(sock, m, args) {
    await sock.reply(m.chat, '¡Este es un mensaje de prueba desde el comando test!');
  },
};
