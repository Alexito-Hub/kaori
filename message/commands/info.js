// commands/info.js

module.exports = {
  name: 'info',
  description: 'Obtener información sobre un comando',
  aliases: ['commandinfo'],

  async execute(sock, m, args) {
    const query = args[0];

    if (!query) {
      v.reply('Por favor, proporciona el nombre o alias del comando para obtener información.');
      return;
    }

    const commandInfo = commands.find(cmd => cmd.name.toLowerCase() === query.toLowerCase() || (cmd.aliases || []).map(alias => alias.toLowerCase()).includes(query.toLowerCase()));

    if (!commandInfo) {
      v.reply(`El comando o alias '${query}' no existe.`);
      return;
    }

    const isEnabled = commandInfo.isEnabled !== undefined ? commandInfo.isEnabled : true;

    const infoMessage = `
Nombre: ${commandInfo.name}
Descripción: ${commandInfo.description || 'No hay descripción disponible.'}
Alias: ${commandInfo.aliases ? commandInfo.aliases.join(', ') : 'No hay alias disponibles.'}
Estado de comando: ${isEnabled ? 'Habilitado' : 'Deshabilitado'}
    `;

    v.reply(infoMessage);
  },
};
