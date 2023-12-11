require('../../config');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadMedia(sock, m) {
  if (!m || !m.message) {
    return null;
  }

  try {
    const fileInfo = await sock.getFile(m.message);
    const buffer = await sock.download(fileInfo);
    return { buffer, mimetype: fileInfo.mimetype };
  } catch (error) {
    console.error('Error al descargar el archivo:', error);
    return null;
  }
}

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

      const mediaInfo = await downloadMedia(sock, m);
      if (!mediaInfo) {
        await sock.sendMessage(m.chat, { text: 'Error al descargar el archivo multimedia.' }, { quoted: m });
        return;
      }

      for (const groupId of groupIds) {
        await sleep(1500);

        await sock.sendMessage(groupId, {
          contextInfo: { remoteJid: groupId },
          [mediaInfo.mimetype.startsWith('image') ? 'image' : mediaInfo.mimetype.startsWith('video') ? 'video' : 'audio']: {
            data: mediaInfo.buffer,
            mimetype: mediaInfo.mimetype
          },
          caption: messageType,
        });
      }

      await sock.sendMessage(m.chat, { text: 'Envío de contenido correcto.' }, { quoted: m });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.chat, { text: 'Error al enviar contenido.' }, { quoted: m });
    }
  },
};
