const fetch = require('node-fetch');
const fs = require('fs');

module.exports = {
    name: 'tiktokdownloader',
    description: 'Descarga un video de TikTok sin marca de agua',
    aliases: ['tiktokdownload', 'tiktokdl', 'tiktok'],

    async execute(sock, m) {
        try {
            const tiktokUrl = m.body.split(' ')[1];

            if (!tiktokUrl) {
                sock.sendMessage(m.chat, {text:'Por favor, proporciona una URL válida de TikTok.'}, { quoted: m });
                return;
            }

            const apiUrl = `https://star-apis.teamfx.repl.co/api/downloader/tiktok?url=${tiktokUrl}&apikey=StarAPI`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.status === 'success' && data.result && data.result.video) {
                const videoUrl = data.result.video;
                
                // Descargar el vídeo
                const videoResponse = await fetch(videoUrl);
                const videoBuffer = await videoResponse.buffer();
                
                // Guardar el vídeo
                const fileName = `tiktok_video_${Date.now()}.mp4`;
                fs.writeFileSync(fileName, videoBuffer);
                
                // Enviar el vídeo
                sock.sendMessage(m.chat, { video: videoBuffer, quoted: m });
                
                // Opcional: Puedes eliminar el archivo después de enviarlo si lo deseas
                fs.unlinkSync(fileName);
            } else {
                sock.sendMessage(m.chat, {text:'No se pudo obtener el vídeo de TikTok. Asegúrate de que la URL sea válida.'}, { quoted: m });
            }
        } catch (error) {
            console.log('Error en la ejecución del comando tiktokdownloader:', error);
            sock.sendMessage(m.chat, {text:'Ocurrió un error al intentar descargar el vídeo de TikTok.'}, { quoted: m });
        }
    }
};
