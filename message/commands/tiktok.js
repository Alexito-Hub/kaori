// Importa las funciones necesarias
const fetchJson = require('../utils').fetchJson; // Ajusta la ruta según la ubicación de tu función fetchJson

// Define el comando
module.exports = {
  name: 'tiktok',
  description: 'Descarga videos e imágenes de TikTok',
  aliases: ['tiktok', 'tt'],

  async execute(sock, m, args) {
    try {
      if (!args[0]) {
        v.reply('*tiktok <url>*');
        return;
      }

      const tiktokUrl = args[0];
      const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);

      if (response && response.result) {
        const result = response.result;

        if (result.type === 'video') {
          // Si es un video, envía el video sin marca de agua
          sock.sendMessage(m.chat, {
            video: { url: result.video.noWatermark },
            mimetype: 'video/mp4',
            caption: 'Descargado desde Kaori'
          }, { quoted: m });
        } else if (result.type === 'images') {
          // Si son imágenes, envía cada imagen sin marca de agua
          for (const image of result.images) {
            sock.sendMessage(m.chat, {
              image: { url: image.url.url, mimetype: 'image/jpeg' },
              caption: 'Descargado desde Kaori'
            }, { quoted: m });
          }
        }
      } else {
        console.log('Error al obtener información de TikTok');
        v.reply('Parece que hubo un problema, inténtalo de nuevo');
      }
    } catch (error) {
      console.log('Error:', error);
      v.reply('Error');
    }
  },
};
