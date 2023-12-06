const { fetchJson } = require('../../lib/utils');

const lastDownloads = new Map();

module.exports = {
  name: 'tiktok',
  description: 'Descarga un video o imagen de TikTok sin marca de agua',
  aliases: ['tiktokdownload', 'tt'],

  async execute(sock, m) {
    try {
      if (m.quoted && m.quoted.text) {
        const tiktokUrl = m.quoted.text.trim();
        await tiktokDownloader(sock, m, tiktokUrl);
      } else if (m.body && m.body.split(' ')[1]) {
        const tiktokUrl = m.body.split(' ')[1].trim();
        await tiktokDownloader(sock, m, tiktokUrl);
      } else {
        v.reply('*[ tiktok <url> ]*', { quoted: m });
      }
    } catch (error) {
      console.log('Error en la ejecución del comando tiktok:', error);
    }
  }
};

// Función para descargar contenido de TikTok (video o imagen)
const tiktokDownloader = async (sock, m, tiktokUrl) => {
  try {
    // Verifica si ya se descargó un contenido para este chat
    if (lastDownloads.has(m.chat)) {
      v.reply('Espera un momento antes de realizar otra descarga.', { quoted: m });
      return;
    }

    // Almacena el tiempo de la última descarga
    lastDownloads.set(m.chat, Date.now());

    const apiUrl = `https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`;
    const response = await fetchJson(apiUrl);

    if (response && response.result) {
      const contentType = response.result.type;

      if (contentType === 'video' && response.result.video && response.result.video.noWatermark) {
        // Envía el video solo si la descarga fue exitosa
        sock.sendMessage(m.chat, {
          video: { url: response.result.video.noWatermark },
          mimetype: 'video/mp4',
          caption: 'Descargado desde Bot Kaori'
        }, { quoted: m });
      } else if (contentType === 'image' && response.result.image) {
        // Envía la imagen solo si la descarga fue exitosa
        sock.sendMessage(m.chat, {
          image: { url: response.result.image },
          mimetype: 'image/jpeg',
          caption: 'Descargado desde Bot Kaori'
        }, { quoted: m });
      } else {
        console.log('Tipo de contenido no admitido o error en la descarga');
        v.reply('Contenido no admitido', { quoted: m });
      }
    } else {
      console.log('Error obteniendo información del contenido de TikTok');
    }
  } catch (error) {
    console.log('Error en la función tiktokDownloader:', error);
    v.reply('No se pudo procesar la descarga.', { quoted: m });
  }
};
