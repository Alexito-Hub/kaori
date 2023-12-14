// Importa la librería necesaria para realizar solicitudes HTTP
const axios = require('axios');

// Comando play
module.exports = {
    name: 'play',
    description: 'Muestra información sobre el contenido y espera confirmación para descargar en formato MP4 o MP3.',
    aliases: ['play'],

    async execute(sock, m) {
        try {
            // Obtiene la URL del video desde el mensaje
            const searchQuery = m.body.slice(m.body.indexOf(' ') + 1);

            // Realiza una búsqueda para obtener información del video
            const searchUrl = `https://star-apis.teamfx.repl.co/api/ytdl/search?query=${encodeURIComponent(searchQuery)}&apikey=StarAPI`;
            const searchResponse = await axios.get(searchUrl);

            // Verifica si se encontraron resultados
            if (searchResponse.data && searchResponse.data.result && searchResponse.data.result.length > 0) {
                const videoInfo = searchResponse.data.result[0]; // Tomar el primer resultado

                // Muestra la información del video y espera confirmación para descargar
                const messageText = `Información del Video:\n\nTítulo: ${videoInfo.title}\nDuración: ${videoInfo.duration}\nVisualizaciones: ${videoInfo.views}\n\n¿Deseas descargar en formato MP4 o MP3?\nResponde con "MP4" o "MP3".`;
                await sock.sendMessage(m.chat, { text: messageText });

                // Espera la respuesta durante un tiempo límite (5 minutos)
                const response = await sock.receiveMessage(m.key.remoteJid, (msg) => {
                    return msg.message?.message?.conversation?.toUpperCase() === 'MP4' || msg.message?.message?.conversation?.toUpperCase() === 'MP3';
                }, 5 * 60 * 1000); // 5 minutos en milisegundos

                // Verifica la respuesta y realiza la descarga si es válida
                if (response) {
                    const format = response.message?.message?.conversation?.toUpperCase();
                    const downloadUrl = `https://star-apis.teamfx.repl.co/api/downloader/ytplay?url=${videoInfo.url}&format=${format}&apikey=StarAPI`;

                    // Realiza la descarga y envía el archivo al usuario
                    const downloadResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
                    await sock.sendMessage(m.key.remoteJid, { buffer: Buffer.from(downloadResponse.data), mimetype: format === 'MP4' ? 'video/mp4' : 'audio/mp3' }, { quoted: m });
                } else {
                    // Si no hay respuesta dentro del tiempo límite, muestra un mensaje indicando la cancelación
                    await sock.sendMessage(m.chat, { text: 'Tiempo de espera agotado. Descarga cancelada.' });
                }
            } else {
                // Si no se encontraron resultados, informa al usuario
                await sock.sendMessage(m.chat, { text: 'No se encontraron resultados para la búsqueda.' });
            }
        } catch (error) {
            console.error('Error en la ejecución del comando play:', error);
            await sock.sendMessage(m.chat, { text: 'Se produjo un error al ejecutar el comando play.' });
        }
    }
};
