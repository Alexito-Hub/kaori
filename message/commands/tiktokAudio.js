const { fetchJson } = require('../../lib/utils');

module.exports = {
    name: 'tiktokaudio',
    description: 'Descarga el audio de un video de TikTok',
    aliases: ['audiotiktok','tiktok-'],
    
    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                await v.reply('*tiktokaudio <url de un vídeo de TikTok>*');
                return;
                
            }
            const tiktokUrl = args[0];
            const response = await fetchJson(`https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`);
            if (response && response.result && response.result.type === 'video') {
                const audioUrl = response.result.music.url;
                await sock.sendMessage(m.chat, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mp4',
                    ppt: true,
                });
            } else {
                await v.reply('No se pudo obtener el audio del video de TikTok');
            }
        } catch (error) {
            console.error('Error:', error);
            await v.reply('Error al ejecutar el comando');
        }
    },
};
