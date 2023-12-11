// Importa las funciones necesarias
const { fetchJson } = require('../../lib/utils')// Ajusta la ruta según la ubicación de tu función fetchJson

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
            sock.sendMessage(m.chat, {react: {text: '🕛',key: m.key,}})
            const subcommand = args[1].toLowerCase();
            const tiktokUrl = args[0];
            const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);
            
            if (subcommand === 'audio') {
                if (!args[1]) {
                    v.reply('*tiktok audio <url>*')
                }
                if (response && response.result && response.result.type === 'video') {
                    const audioUrl = response.result.music.url;
                    sock.sendMessage(m.chat, {
                        audio: { url: audioUrl },
                        mimetype: 'audio/mp4',
                        ppt: true,
                    });
                    return;
                } else {
                    console.log('Error al obtener información de TikTok para el subcomando audio');
                    v.reply('Parece que hubo un problema al obtener el audio, inténtalo de nuevo');
                    return;
                }
            }
            
            function roundTime(time) {
                return Math.round(time);
            }
            
            const responseMs = Date.now();
            const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
            const formattedResponseTime = (responseTime / 1000).toFixed(3);

            if (response && response.result) {
                const result = response.result;
                if (result.type === 'video') {
                    sock.sendMessage(m.chat, {react: {text: '🎥',key: m.key,}})
                    sock.sendMessage(m.chat, {
                        video: { url: result.video.noWatermark },
                        mimetype: 'video/mp4',
                        caption: `ㅤ *⋯⋯ TIK TOK ⋯⋯*
 ∘ *Autor:* ${result.author.name}
 ∘ *Likes:* ${result.information.likeCount}
 ∘ *Comentarios:* ${result.information.commentCount}
 ∘ *Fecha:* ${result.information.created_at}
 ∘ *Titulo:* ${result.information.title}`
                    }, {quoted:m});
                } else if (result.type === 'images') {
                    for (const image of result.images) {
                        sock.sendMessage(m.chat, {react: {text: '📷',key: m.key,}})
                        sock.sendMessage(m.chat, {
                            image: { url: image.url.url, mimetype: 'image/jpeg' },
                            caption: `᳃ ¡Listo! - *🧃 ${formattedResponseTime} ms*`
                        }, {quoted:m});
          }
        }
      } else {
        console.log('Error al obtener información');
        sock.sendMessage(m.chat, {react: {text: '❌',key: m.key,}})
        v.reply(`Hubo un problema al obtener información?`);
      }
    } catch (error) {
      console.log('Error:', error);
      v.reply('Error');
    }
  },
};
