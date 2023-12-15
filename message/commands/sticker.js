const fs = require('fs');

module.exports = {
  name: 'sticker',
  description: 'Convierte una imagen o video en sticker.',
  
  async execute(sock, m, args) {
    try {
      const mime = m.mimetype;
      const isImage = /image/.test(mime);
      const isVideo = /video/.test(mime);

      if (!isImage && !isVideo) {
        await sock.sendMessage(m.chat, { text: 'Envía una imagen o video para convertir en sticker.' }, { quoted: m });
        return;
      }

      const media = await sock.downloadMediaMessage(m);
      
      if (isImage) {
        const sticker = await sock.sendImageAsSticker(m.chat, media, { pack: 'x', author: 'd' });
        await fs.unlinkSync(sticker);
      } else if (isVideo) {
        if (m.seconds > 40) {
          await sock.sendMessage(m.chat, { text: '¡La duración máxima del video es de 40 segundos!' }, { quoted: m });
          return;
        }
        
        const sticker = await sock.sendVideoAsSticker(m.chat, media, { pack: 'x', author: 'd' });
        await fs.unlinkSync(sticker);
      }

      await sock.sendMessage(m.chat, { text: 'Sticker generado correctamente.' }, { quoted: m });
    } catch (error) {
      console.error(error);
      await sock.sendMessage(m.chat, { text: 'Error al procesar el comando de sticker.' }, { quoted: m });
    }
  },
};
