const { fetchJson } = require('../../lib/utils');

module.exports = {
    name: 'tiktok',
    description: 'Descarga videos e imágenes de TikTok',
    aliases: ['tiktok', 'tt'],
    
    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await v.reply('*tiktok <url>*');
                return;
            }
            const tiktokUrl = args[0];
            await sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });
            
            if (args[1] && args[1].toLowerCase() === 'audio') {
                const audioResponse = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok/audio?url=${tiktokUrl}&apikey=StarAPI`);
                if (audioResponse && audioResponse.result === 'music') {
                    await sock.sendMessage(m.chat, {
                        audio: { url: audioResponse.result.music.url },
                        mimetype: 'audio/mp4',
                        ppt: true
                    }, { quoted: m });
                } else {
                    console.log('Error al obtener información del audio de TikTok');
                    await v.reply('Hubo un error al descargar');
                }
                
            } else {
                const videoResponse = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);
                function roundTime(time) {
                    return Math.round(time);
                }
                
                const responseMs = Date.now();
                const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
                const formattedResponseTime = (responseTime / 1000).toFixed(3);
                
                if (videoResponse && videoResponse.result) {
                    const result = videoResponse.result;
                    if (result.type === 'video') {
                        await sock.sendMessage(m.chat, {
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
                            await sock.sendMessage(m.chat, {
                                image: { url: image.url.url, mimetype: 'image/jpeg' },
                                caption: `¡Listo! - *🧃 ${formattedResponseTime} ms*`,
                                
                            }, { quoted: m });
                        }
                    }
                } else {
                    console.log('Error al obtener información de TikTok');
                    await sock.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                    await v.reply('Parece que hubo un problema. Inténtalo de nuevo.');
                }
            }
        } catch (error) {
            console.log('Error:', error);
            await v.reply('Error al ejecutar el comando.');
        }
    },
};
