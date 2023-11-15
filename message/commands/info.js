// commands/info.js
const executeInfoCommand = async (sock, m, allCommands) => {
  const args = m.body.trim().split(/ +/).slice(1); // Obtén los argumentos del mensaje
  const targetCommand = args[0];

  if (!targetCommand) {
    // Si no se proporciona un comando específico, muestra información general
    const infoMessage = 'Información de los comandos disponibles:\n\n';
    const commandInfo = allCommands.map(command => {
      const aliases = command.aliases ? `, Aliases: ${command.aliases.join(', ')}` : '';
      return `- Nombre: ${command.name}${aliases}\n   Descripción: ${command.description}\n`;
    });
    sock.reply(m.chat, infoMessage + commandInfo.join('\n'));
  } else {
    // Si se proporciona un comando específico, busca y muestra información sobre ese comando
    const selectedCommand = allCommands.find(command => command.name === targetCommand || (command.aliases && command.aliases.includes(targetCommand)));
    
    if (selectedCommand) {
      const aliases = selectedCommand.aliases ? `, Aliases: ${selectedCommand.aliases.join(', ')}` : '';
      const infoMessage = `- Nombre: ${selectedCommand.name}${aliases}\n   Descripción: ${selectedCommand.description}\n`;
      sock.reply(m.chat, `Información sobre el comando "${targetCommand}":\n\n${infoMessage}`);
    } else {
      sock.reply(m.chat, `El comando "${targetCommand}" no fue encontrado.`);
    }
  }
};

module.exports = {
  name: 'info',
  description: 'Obtiene información sobre los comandos disponibles',
  execute: executeInfoCommand,
};
