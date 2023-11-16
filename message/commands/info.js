// commands/info.js

module.exports = {
  name: 'info',
  description: 'Obtener información sobre un comando',
  aliases: ['info', 'información'],

  async execute(sock, m, args) {
    const commandName = args[0];

    if (!commandName) {
      v.reply('Por favor, proporciona el nombre o alias del comando para obtener información.');
      return;
    }

    const commandInfo = getCommandInfo(commandName.toLowerCase());

    if (!commandInfo) {
      v.reply(m.chat, `El comando o alias '${commandName}' no existe.`);
      return;
    }

    const isEnabled = commandInfo.isEnabled !== undefined ? commandInfo.isEnabled : true;

    const infoMessage = `
Nombre: ${commandInfo.name}
Descripción: ${commandInfo.description || 'No hay descripción disponible.'}
Alias: ${commandInfo.aliases ? commandInfo.aliases.join(', ') : 'No hay alias disponibles.'}
Estado de comando: ${isEnabled ? 'Habilitado' : 'Deshabilitado'}
    `;

    v.reply(m.chat, infoMessage);
  },
};
