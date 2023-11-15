// commands/test.js
const executeTestCommand = async (sock, m) => {
  sock.reply(m.chat, 'pruebs');
};

module.exports = {
  name: 'test',
  description: 'prueba',
  aliases: ['testing', 'try'],
  execute: executeTestCommand,
};
