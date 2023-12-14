const ytdl = require('ytdl-core');

module.exports = {
    name: 'play',
    description: 'Busca y reproduce el primer video de YouTube.',

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                v.reply('Por favor, proporciona una búsqueda válida.');
                return;
            }

            const searchQuery = args.join(' ');
            const searchResult = await ytdl.getBasicInfo(searchQuery, { 'format': 'mp4' });

            if (!searchResult) {
                v.reply('No se encontraron resultados.');
                return;
            }

            const videoInfo = searchResult.videoDetails;
            const videoUrl = `https://star-apis.teamfx.repl.co/api/downloader/ytplay?url=${videoInfo.video_url}&apikey=StarAPI`;

            await sock.sendMessage(m.chat, { 
                video: { url: videoUrl },
                mimetype: 'video/mp4',
                caption: `${videoInfo.title}`
            }, { quoted: m });
        } catch (error) {
            console.error('Error en el comando play:', error);
            v.reply('Ocurrió un error al ejecutar el comando play.');
        }
    },
};
