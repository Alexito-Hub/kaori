const { fetchJson } = require('../../lib/utils');

const lastDownloads = new Map();

module.exports = {
  name: 'tiktok',
  description: 'Descarga un video de TikTok sin marca de agua',
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
        v.reply('Por favor, proporciona un enlace de TikTok para descargar el video.', { quoted: m });
      }
    } catch (error) {
      console.log('Error en la ejecución del comando tiktok:', error);
    }
  }
};

const tiktokDownloader = async (sock, m, tiktokUrl) => {
  try {
    if (lastDownloads.has(m.chat)) {
      v.reply('Espera un momento antes de realizar otra descarga.', { quoted: m });
      return;
    }
    lastDownloads.set(m.chat, Date.now());

    const apiUrl = `https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`;
    const response = await fetchJson(apiUrl);

    if (response && response.result && response.result.video && response.result.video.noWatermark) {
      sock.sendMessage(m.chat, {
        video: { url: response.result.video.noWatermark },
        mimetype: 'video/mp4',
        caption: 'Descargado desde Kaori'
      }, { quoted: m });
    } else {
      console.log('Error obteniendo información del video de TikTok');
      v.reply('Error al obtener información del video de TikTok.', { quoted: m });
    }
  } catch (error) {
    console.error('Error en la función tiktokDownloader:', error);
    v.reply('Error al procesar la solicitud. Intenta de nuevo más tarde.', { quoted: m });
  }
};
