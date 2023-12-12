const ytdl = require('ytdl-core');

module.exports = {
    name: 'youtube',
    description: 'Descarga video o audio de YouTube',
    aliases: ['yt'],
    
    async execute(sock, m, args) {
        try {
            if (!args[0]) {
                sock.sendMessage(m.chat, { text: '*youtube <URL> --audio*' }, { quoted: m });
                return;
            }

            const youtubeUrl = args[0];
            const isAudio = args.includes('--audio') || args.includes('-a');

            const info = await ytdl.getInfo(youtubeUrl);
            const format = isAudio ? ytdl.chooseFormat(info.formats, { quality: 'highestaudio' }) : ytdl.chooseFormat(info.formats, { quality: 'highest' });

            if (!format) {
                sock.sendMessage(m.chat, { text: 'No se pudo obtener el formato del video o audio.' }, { quoted: m });
                return;
            }

            // Descargar el video o audio
            const readableStream = ytdl.downloadFromInfo(info, { format });

            // Subir el video o audio a la conversación
            if (isAudio) {
                sock.sendMessage(m.chat, {
                    audio: {
                        url: format.url,
                        mimetype: 'audio/mp4', // Puedes ajustar el tipo MIME según la necesidad
                        ptt: true
                    },
                    quoted: m
                });
            } else {
                sock.sendMessage(m.chat, {
                    video: {
                        url: format.url,
                        mimetype: 'video/mp4', // Puedes ajustar el tipo MIME según la necesidad
                        filename: 'video.mp4',
                        caption: 'Aquí está tu video'
                    },
                    quoted: m
                });
            }
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
