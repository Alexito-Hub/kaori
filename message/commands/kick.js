module.exports = {
  name: 'kick',
  description: 'Expulsa a un miembro del grupo',
  aliases: ['expulsar'],

  async execute(sock, m, args) {
    try {
      // Verificar si el bot es administrador del grupo
      const isBotAdmin = await sock.isGroupAdmin(m.chat, sock.user.id);

      // Verificar si el remitente del mensaje es administrador del grupo
      const isSenderAdmin = await sock.isGroupAdmin(m.chat, m.sender);

      // Verificar si se proporciona un usuario a expulsar
      if (args.length === 0 && !m.quoted) {
        v.reply('*kick <@usuario>*');
        return;
      }

      // Obtener el ID del usuario a expulsar
      const targetUser = (args.length > 0) ? args[0].replace('@', '').replace(/\s/g, '') + '@s.whatsapp.net' : m.quoted.sender;

      // Verificar si el bot y el remitente del mensaje son administradores
      if (isBotAdmin && isSenderAdmin) {
        // Expulsar al usuario del grupo
        await sock.groupRemove(m.chat, [targetUser]);

        // Enviar mensaje de éxito
        v.reply(`Usuario ${targetUser} expulsado del grupo.`);
      } else {
        // Enviar mensaje de error si el bot o el remitente no son administradores
        v.reply('Solo los administradores pueden expulsar a miembros del grupo.');
      }
    } catch (error) {
      console.error('Error:', error);
      v.reply('Error al ejecutar el comando');
    }
  },
};
