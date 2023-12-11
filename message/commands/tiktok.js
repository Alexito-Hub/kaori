const { fetchJson } = require('../../lib/utils')

module.exports = {
    name: 'tiktok',
    description: 'Descarga videos e imágenes de TikTok',
    aliases: ['tiktok', 'tt'],
    
    async execute(sock, m, args) {
        try {
            function roundTime(time) {
                return Math.round(time);
            }
            const responseMs = Date.now();
            const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
            const formattedResponseTime = (responseTime / 1000).toFixed(3);
            
            const subCommand = args[0].toLowerCase();
            switch (subCommand) {
                case 'audio':
                    if (!args[1]) {
                        v.reply('*tiktok audio <url>*');
                        return;
                    }
                    const tiktokAudioUrl = args[1];
                    const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokAudioUrl}&apikey=StarAPI`);
                    if (response && response.result) {
                        const result = response.result
                        sock.sendMessage(m.chat, {
                            audio:{ url: result.music.url },
                            mimetype: 'audio/mp4',
                            ppt: true
                        });
                    } else {
                        v.reply('Error al descargar')
                    }
                    
                    break
                default:
                    if (!args[0]) {
                        v.reply('*tiktok <url>*');
                        return;
                    }
                    const tiktokUrl = args[0];
                    const responseUrl = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);
                    
                    if (responseUrl && responseUrl.result) {
                        const result = responseUrl.result;
                        sock.sendMessage(m.chat, {react: {text: '🕛',key: m.key,}})
                        if (result.type === 'video') {
                            sock.sendMessage(m.chat, {
                                video: { url: result.video.noWatermark },
                                mimetype: 'video/mp4',
                                caption: `ㅤ *- - TIK TOK*
        *Autor:* ${result.author.name}
        *Like:* ${result.information.likeCount}
        *Comentarios:* ${result.information.commentCount}
        *Fecha:* ${result.information.created_at}
        *Titulo:* ${result.information.title}`
                            }, {quoted:m});
                        } else if (result.type === 'images') {
                            for (const image of result.images) {
                                sock.sendMessage(m.chat, {
                                    image: { url: image.url.url, mimetype: 'image/jpeg' },
                                    caption: `¡Listo! - *🧃 ${formattedResponseTime} ms*`
                                }, {quoted:m});
                            }
                        }
                    } else {
                        console.log('Error al obtener información de TikTok');
                        v.reply('Error al descargar');
                    }
                    break
            }
        } catch (error) {
            console.log('Error:', error);
            v.reply('Hubo un tremendo problema 😵‍💫');
        }
    },
};
