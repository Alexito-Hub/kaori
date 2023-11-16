// commands/info.js
module.exports = {
  name: 'info',
  aliases: ['info', 'information'],
  execute: async (sock, m, args) => {
    // Lógica para el comando 'info'
    if (args.length === 0) {
      v.reply(m.chat, 'Por favor, proporciona un comando para obtener información.');
      return;
    }

    const commandName = args[0].toLowerCase();
    const commandInfo = getCommandInfo(commandName);

    if (commandInfo) {
      const infoMessage = `Información sobre el comando ${commandInfo.name}:\n\nAliases: ${commandInfo.aliases ? commandInfo.aliases.join(', ') : 'Ninguno'}\nDescripción: ${commandInfo.description || 'Sin descripción'}`;
      v.reply(m.chat, infoMessage);
    } else {
      v.reply(m.chat, `No se encontró información para el comando ${commandName}.`);
    }
  },
};
