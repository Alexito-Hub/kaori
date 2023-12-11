require('../../config');

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
        await sock.sendMessage(m.chat, { text: 'Solo el Staff puede usar el comando.' }, { quoted: m });
        return;
      }

      const groups = await sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      
      const messageType = args.join(' ');
      if (!messageType) return await sock.sendMessage(m.chat, { text: '¿Falta de ideas para un mensaje?' }, { quoted: m });
      
      if (m.type === 'imageMessage' || m.type === 'videoMessage' || m.type === 'audioMessage') {
        const mediaType = m.type === 'imageMessage' ? 'image' : m.type === 'videoMessage' ? 'video' : 'audio';

        for (const groupId of groupIds) {
          await sleep(1500);

          const buffer = await sock.downloadMediaMessage(m);
          await sock.sendMessage(groupId, {
            contextInfo: { remoteJid: groupId },
            [mediaType]: { url: buffer, mimetype: m[mediaType + 'Message'].mimetype },
            caption: messageType,
          });
        }
      } else {
        for (const groupId of groupIds) {
          await sleep(1500);

          await sock.sendMessage(groupId, { text: messageType, contextInfo: { remoteJid: groupId } });
        }
      }

      await sock.sendMessage(m.chat, { text: 'Envío de contenido correcto.' }, { quoted: m });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.chat, { text: 'Error al enviar contenido' }, { quoted: m });
    }
  },
};
