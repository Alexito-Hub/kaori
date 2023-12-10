require('../../config');
const { fetchJson } = require('../../lib/utils');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
  name: 'tagall',
  description: 'Etiqueta a todos los miembros de los grupos en los que participa el bot',
  aliases: ['tag', 'todos', 'all'],

  async execute(sock, m, args) {
    try {
      const isOwner = owner.includes(m.sender.split('@')[0]);
      const isStaff = staff.includes(m.sender.split('@')[0]) || isOwner;

      if (!isStaff) {
        // Si no es staff, enviar un mensaje indicando que no tiene permisos
        await sock.sendMessage(m.chat, { text: 'Solo el staff tiene permiso para usar este comando.' }, { quoted: m });
        return;
      }

      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      
      const messageType = args.join(' ');
      
      if (m.type === 'imageMessage' || m.type === 'videoMessage') {
        const mediaType = m.type === 'imageMessage' ? 'image' : 'video';

        for (const groupId of groupIds) {
          await sleep(1500);

          await sock.sendMessage(groupId, {
            [mediaType]: { url: m[mediaType + 'Message'].url, mimetype: m[mediaType + 'Message'].mimetype },
            caption: messageType,
          }, { quoted: m });
        }
      } else {
        for (const groupId of groupIds) {
          await sleep(1500);

          await sock.sendMessage(groupId, { text: messageType}, { quoted: m });
        }
      }

      await sock.sendMessage(m.chat, { text: 'Envío de mensaje correcto.' }, { quoted: m });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.chat, { text: 'Error al realizar el envío de mensajes' }, { quoted: m });
    }
  },
};
