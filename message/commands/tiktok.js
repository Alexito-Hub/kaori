const axios = require('axios');
const fs = require('fs');

module.exports = {
    name: 'tiktokdownloader',
    description: 'Descarga videos de TikTok',
    aliases: ['tiktokdl'],

    async execute(sock, m) {
        try {
            const tiktokUrl = m.body.split(' ')[1];

            if (!tiktokUrl) {
                sock.sendMessage(m.chat, {text:'Por favor, proporciona una URL válida de TikTok.'}, { quoted: m });
                return;
            }

            const apiUrl = `https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${encodeURIComponent(tiktokUrl)}&apikey=StarAPI`;

            const response = await axios.get(apiUrl, { responseType: 'stream' });

            const videoStream = response.data.pipe(fs.createWriteStream(`./downloads/tiktok_video.mp4`));

            videoStream.on('finish', () => {
                sock.sendMessage(m.chat, {text:'¡Descarga completada! El video de TikTok se encuentra en la carpeta de descargas.'}, { quoted: m });
            });
        } catch (error) {
            console.log('Error en la ejecución del comando tiktokdownloader:', error);
            sock.sendMessage(m.chat, {text:'Ocurrió un error al intentar descargar el video de TikTok.'}, { quoted: m });
        }
    }
};
