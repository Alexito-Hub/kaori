const ytdl = require('ytdl-core');

module.exports = {
    name: 'youtube',
    description: 'Descarga video o audio de YouTube',
    
    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                sock.sendMessage(m.chat, { text: '*youtube <URL>*' }, { quoted: m });
                return;
            }

            const youtubeUrl = args[0];
            const isAudio = args.includes('--audio') || args.includes('-a');

            const info = await ytdl.getInfo(youtubeUrl);
            const format = isAudio ? ytdl.chooseFormat(info.formats, { quality: 'highestaudio' }) : info.formats.find(f => f.qualityLabel === '720p' && f.container === 'mp4');

            if (!format) {
                sock.sendMessage(m.chat, { text: 'No se pudo obtener el formato del video o audio.' }, { quoted: m });
                return;
            }

            const readableStream = ytdl.downloadFromInfo(info, { format });

            // Puedes adaptar esto según tu necesidad, por ejemplo, guardar el archivo o enviarlo como mensaje
            if (isAudio) {
                sock.sendMessage(m.chat, {
                    audio: {
                        url: format.url,
                        mimetype: format.mimeType,
                        ptt: true
                    }
                }, { quoted: m });
            } else {
                // Envía el video como un mensaje
                sock.sendMessage(m.chat, {
                    video: {
                        url: format.url,
                        mimetype: format.mimeType,
                        filename: 'video.mp4'
                    }
                }, { quoted: m });
            }
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
