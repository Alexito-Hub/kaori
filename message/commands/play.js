const ytsr = require('ytsr');
const axios = require('axios');

module.exports = {
    name: 'play',
    description: 'Buscar y mostrar información del primer video relacionado con la búsqueda.',
    aliases: ['p'],

    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                return sock.sendMessage(m.chat, { text: 'Por favor, proporciona una búsqueda.' });
            }

            const searchQuery = args.join(' ');
            const searchResults = await ytsr(searchQuery, { limit: 1 });

            if (searchResults && searchResults.items && searchResults.items.length > 0) {
                const firstVideo = searchResults.items[0];
                const videoInfo = `*Título:* ${firstVideo.title}\n*Duración:* ${firstVideo.duration || 'Desconocida'}\n*Visitas:* ${firstVideo.views || 'Desconocido'}\n*Enlace:* ${firstVideo.url}`;

                await sock.sendMessage(m.chat, { text: `Información del Video:\n${videoInfo}`, quoted: m });

                const confirmationMessage = '¿Quieres descargar el video como MP4 o MP3?\n\n1. MP4\n2. MP3';
                await sock.sendMessage(m.chat, { text: confirmationMessage });

                const response = await sock.receiveMessage(m.chat);
                const choice = response.text.toLowerCase();

                if (choice === '1' || choice === 'mp4') {
                    await downloadAndSendVideo(sock, m, firstVideo.url, 'video/mp4');
                } else if (choice === '2' || choice === 'mp3') {
                    await downloadAndSendVideo(sock, m, firstVideo.url, 'audio/mp3');
                } else {
                    sock.sendMessage(m.chat, { text: 'Opción no válida. La descarga ha sido cancelada.' });
                }
            } else {
                sock.sendMessage(m.chat, { text: 'No se encontraron resultados para la búsqueda.' });
            }
        } catch (error) {
            console.error('Error en el comando play:', error);
            sock.sendMessage(m.chat, { text: 'Se produjo un error al ejecutar el comando play.' });
        }
    },
};

async function downloadAndSendVideo(sock, m, videoUrl, mimeType) {
    try {
        const downloadUrl = `https://star-apis.teamfx.repl.co/api/downloader/ytplay?url=${encodeURIComponent(videoUrl)}&apikey=StarAPI`;

        await sock.sendMessage(m.chat, { text: 'Descargando el video...', quoted: m });
        await sock.sendMessage(m.chat, { video: { url: downloadUrl }, mimetype: mimeType, quoted: m });
    } catch (error) {
        console.error('Error al descargar y enviar el video:', error);
        sock.sendMessage(m.chat, { text: 'Se produjo un error al descargar y enviar el video.' });
    }
}
