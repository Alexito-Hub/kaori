module.exports = {
  name: 'kick',
  description: 'Expulsa a un miembro del grupo',
  aliases: ['expulsar'],

  async execute(sock, m, args) {
    try {
      // Obtener información del grupo
      const groupInfo = await sock.groupMetadata(m.chat);
      console.log('Información del grupo:', groupInfo);

      // Verificar si el remitente del mensaje es administrador del grupo
      const isAdmin = groupInfo && groupInfo.participants.some(p => p.id == m.sender && ['admin', 'superadmin'].includes(p.admin));
      console.log('Es administrador del grupo:', isAdmin);

      // Verificar si se proporciona un usuario a expulsar
      if (args.length === 0 && !m.quoted) {
        sock.sendMessage(m.chat, '*kick <@usuario>*', { quoted: m });
        return;
      }

      // Obtener el ID del usuario a expulsar
      const targetUser = (args.length > 0) ? args[0].replace('@', '').replace(/\s/g, '') + '@s.whatsapp.net' : m.quoted.sender;

      // Verificar si el remitente del mensaje es administrador
      if (isAdmin) {
        // Expulsar al usuario del grupo
        await sock.groupRemove(m.chat, [targetUser]);

        // Enviar mensaje de éxito
        sock.sendMessage(m.chat, `Usuario ${targetUser} expulsado del grupo.`, { quoted: m });
      } else {
        // Enviar mensaje de error si el remitente no es administrador
        sock.sendMessage(m.chat, 'Solo los administradores pueden expulsar a miembros del grupo.', { quoted: m });
      }
    } catch (error) {
      console.error('Error:', error);
      sock.sendMessage(m.chat, 'Error al ejecutar el comando', { quoted: m });
    }
  },
};
