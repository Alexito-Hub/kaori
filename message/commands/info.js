// commands/info.js

module.exports = {
  name: 'info',
  aliases: [],
  description: 'Obtiene información sobre un comando específico',

  async execute(sock, m, args) {
    const requestedCommand = args[0];
    const commandInfo = getCommandInfo(requestedCommand.toLowerCase());

    if (commandInfo) {
      const status = commandInfo.disabled ? 'deshabilitado' : 'habilitado';
      const infoMessage = `Nombre: ${commandInfo.name}\nDescripción: ${commandInfo.description}\nAlias: ${commandInfo.aliases.join(', ')}\nEstado del comando: ${status}`;
      v.reply(m.chat, infoMessage);
    } else {
      v.reply(m.chat, `El comando ${requestedCommand} no existe.`);
    }
  },
};
