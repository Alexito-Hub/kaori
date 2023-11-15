// test.js

module.exports = {
  name: 'test',
  aliases: ['testing'],
  description: 'Comando de prueba',

  async execute(sock, m) {
    // Lógica del comando
    await sock.reply(m.chat, '¡Este es un mensaje de prueba desde el comando test!');
  },
};
