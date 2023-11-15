// commands/test.js
module.exports = {
  name: 'test',
  aliases: ['t', 'testing', 'test'], // Agrega los aliases aquí
  execute: async (sock, m) => {
    // Lógica del comando 'test'
    v.reply('¡Respuesta del comando test!');
  },
};
