const ytsr = require('ytsr');
const axios = require('axios');

module.exports = {
    name: 'play',
    description: 'Buscar y reproducir el primer video relacionado con la búsqueda.',
    aliases: ['p'],

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                return sock.sendMessage(m.chat, 'Por favor, proporciona una búsqueda.');
            }

            const searchQuery = args.join(' ');
            const searchResults = await ytsr(searchQuery, { limit: 1 });

            if (searchResults && searchResults.items && searchResults.items.length > 0) {
                const firstVideo = searchResults.items[0];
                const videoInfoText = `Información del Video:\n\nTítulo: ${firstVideo.title}\nDuración: ${firstVideo.duration}\nVisualizaciones: ${firstVideo.views}\n\n¿Deseas reproducir o descargar? Responde con "reproducir", "descargar MP4" o "descargar MP3".`;

                await sock.sendMessage(m.chat, { text: videoInfoText });

                const response = await sock.receiveMessage(m.key.remoteJid, (msg) => {
                    const lowerCaseMessage = msg.message?.message?.conversation?.toLowerCase();
                    return lowerCaseMessage === 'descargar mp4' || lowerCaseMessage === 'descargar mp3';
                }, { timeout: 300000 }); // 5 minutos de tiempo de espera

                if (response) {
                    const choice = response.message?.message?.conversation?.toLowerCase();

                    if (choice === 'reproducir') {
                        await sock.sendMessage(m.chat, { text: `Reproduciendo: ${firstVideo.title}`, url: firstVideo.url }, { quoted: m });
                    } else if (choice === 'descargar mp4') {
                        const downloadUrl = `https://star-apis.teamfx.repl.co/api/downloader/ytplay?url=${encodeURIComponent(firstVideo.url)}&apikey=StarAPI`;
                        const downloadResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

                        await sock.sendMessage(m.key.remoteJid, { buffer: Buffer.from(downloadResponse.data), mimetype: 'video/mp4' }, { quoted: m });
                    } else if (choice === 'descargar mp3') {
                        const downloadUrl = `https://star-apis.teamfx.repl.co/api/downloader/ytplay?url=${encodeURIComponent(firstVideo.url)}&apikey=StarAPI&type=audio`;
                        const downloadResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

                        await sock.sendMessage(m.key.remoteJid, { buffer: Buffer.from(downloadResponse.data), mimetype: 'audio/mp3' }, { quoted: m });
                    }
                }
            } else {
                sock.sendMessage(m.chat, 'No se encontraron resultados para la búsqueda.');
            }
        } catch (error) {
            console.error('Error en el comando play:', error);
            sock.sendMessage(m.chat, 'Se produjo un error al ejecutar el comando play.');
        }
    },
};
