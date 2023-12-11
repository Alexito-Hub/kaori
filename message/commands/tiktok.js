const { fetchJson } = require('../../lib/utils');

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

      if (args[1] && args[1].toLowerCase() === 'audio') {
        // Subcomando para descargar solo el audio
        const audioResponse = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);
        if (audioResponse && audioResponse.result && audioResponse.result.type === 'video') {
          const audioResult = audioResponse.result;
          sock.sendMessage(m.chat, {
            audio: { url: audioResult.music.url },
            mimetype: 'audio/mp4',
            ppt: true,
          });
        } else {
          sock.sendMessage(m.chat, { text: 'Error al obtener el audio de TikTok' }, { quoted: m });
        }
      } else {
        // Subcomando para descargar video o imágenes
        const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);

        if (response && response.result) {
          const result = response.result;
          sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });

          if (result.type === 'video') {
            sock.sendMessage(m.chat, {
              video: { url: result.video.noWatermark },
              mimetype: 'video/mp4',
              caption: `ㅤ *- - TIK TOK*
*Autor:* ${result.author.name}
*Like:* ${result.information.likeCount}
*Comentarios:* ${result.information.commentCount}
*Fecha:* ${result.information.created_at}
*Titulo:* ${result.information.title}`,
            }, { quoted: m });
          } else if (result.type === 'images') {
            for (const image of result.images) {
              sock.sendMessage(m.chat, {
                image: { url: image.url.url, mimetype: 'image/jpeg' },
                caption: `¡Listo! - *🧃 ${formattedResponseTime} ms*`,
              }, { quoted: m });
            }
          }
        } else {
          console.log('Error al obtener información de TikTok');
          sock.sendMessage(m.chat, { text: 'Parece que hubo un problema, inténtalo de nuevo' }, { quoted: m });
        }
      }
    } catch (error) {
      console.log('Error:', error);
      sock.sendMessage(m.chat, { text: 'Error' }, { quoted: m });
    }
  },
};
