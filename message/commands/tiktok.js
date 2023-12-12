const { fetchJson } = require('../../lib/utils');

module.exports = {
    name: 'tiktok',
    description: 'Descarga videos e imágenes de TikTok',
    aliases: ['tiktok', 'tt'],

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await sock.sendMessage(m.chat, { text: '*tiktok <url>*' }, { quoted: m });
                return;
            }

            await sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });
            const isAudio = args.includes('--audio') || args.includes('-a');

            const tiktokUrl = args[0];
            const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);

            function roundTime(time) {
                return Math.round(time);
            }

            const responseMs = Date.now();
            const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
            const formattedResponseTime = (responseTime / 1000).toFixed(3);

            if (response && response.result) {
                const result = response.result;

                if (isAudio) {
                    await sock.sendMessage(m.chat, {
                        audio: { url: result.music.url },
                        mimetype: 'audio/mp4',
                        ppt: true,
                    }, { quoted: m });
                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                } else if (result.type === 'video') {
                    await sock.sendMessage(m.chat, {
                        video: { url: result.video.noWatermark },
                        mimetype: 'video/mp4',
                        caption: `ㅤ *⋯⋯ TIK TOK ⋯⋯*
 ∘ *Autor:* ${result.author.name}
 ∘ *Likes:* ${result.information.likeCount}
 ∘ *Comentarios:* ${result.information.commentCount}
 ∘ *Duración:* ${result.video.durationFormatted}
 ∘ *Fecha:* ${result.information.created_at}
 ∘ *Titulo:* ${result.information.title}`
                    }, { quoted: m });
                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                } else if (result.type === 'images') {
                    for (const image of result.images) {
                        await sock.sendMessage(m.chat, {
                            image: { url: image.url.url, mimetype: 'image/jpeg' },
                            caption: `᳃ ¡Listo! - *🧃 ${formattedResponseTime} ms*`
                        }, { quoted: m });
                    }
                    await sock.sendMessage(m.chat, {
                        audio: { url: result.music.url },
                        mimetype: 'audio/mp4',
                        ppt: true,
                    }, { quoted: m });
                    await sock.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                }
            } else {
                console.log('Error al obtener información');
                await sock.sendMessage(m.chat, { react: { text: '❎', key: m.key } });
                await sock.sendMessage(m.chat, { text: 'No se pudo descargar' }, { quoted: m });
            }
        } catch (e) {
            console.error(e);
            await sock.sendMessage(m.chat, { text: `${e}` });
        }
    },
};
