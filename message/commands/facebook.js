const { fetchJson } = require('../../lib/utils')

module.exports = {
  name: 'facebook',
  description: 'Descarga videos e imágenes de Facebook',
  aliases: ['facebook', 'fb'],

  async execute(sock, m, args) {
    try {
      if (!args[0]) {
        v.reply('*facebook <url>*');
        return;
      }

      const facebookUrl = args[0];
      const response = await fetchJson(`https://fbdl.felixglz.repl.co/fb-info?url=${facebookUrl}`);

      if (response && response.result) {
        const result = response.result;

        if (result.hd) {
          sock.sendMessage(m.chat, {
            video: { url: result.hd },
            mimetype: 'video/mp4',
            caption: 'Descargado desde Kaori'
          }, { quoted: m });
        } else if (result.images) {
          for (const image of result.image) {
            sock.sendMessage(m.chat, {
              image: { url: image, mimetype: 'image/jpeg' },
              caption: 'Descargado desde Kaori'
            }, { quoted: m });
          }
        }
      } else {
        console.error('Error al obtener información de Facebook');
        v.reply('Error al obtener información de Facebook.');
      }
    } catch (error) {
      console.error('Error:', error);
      v.reply('Se produjo un error al procesar la solicitud.');
    }
  },
};
