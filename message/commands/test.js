// commands/test.js

module.exports = {
  name: 'test',
  aliases: ['testing', 'test'],
  description: 'Comando de prueba',

  async execute(sock, m, args) {
    v.reply('¡Este es un mensaje de prueba desde el comando test!');
  },
};
