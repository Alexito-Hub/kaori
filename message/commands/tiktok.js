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

      const subCommand = args.shift().toLowerCase();

      if (subCommand === 'audio') {
        // Lógica para el subcomando "audio"
        const tiktokUrl = args[0];
        const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);

        if (response && response.result && response.result.type === 'video') {
          const audioUrl = response.result.music.url;

          sock.sendMessage(m.chat, {
            audio: { url: audioUrl },
            mimetype: 'audio/mp4',
            ppt: true,
          });
        } else {
          v.reply('No se pudo obtener el audio del video de TikTok');
        }
      } else {
        // Lógica para el comando principal "tiktok"
        const tiktokUrl = subCommand;
        const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);

        function roundTime(time) {
          return Math.round(time);
        }

        const responseMs = Date.now();
        const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
        const formattedResponseTime = (responseTime / 1000).toFixed(3);

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
          v.reply('Parece que hubo un problema, inténtalo de nuevo');
        }
      }
    } catch (error) {
      console.log('Error:', error);
      v.reply('Error');
    }
  },
};
