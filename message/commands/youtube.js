const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

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
            const format = isAudio ? ytdl.chooseFormat(info.formats, { quality: 'highestaudio' }) : ytdl.chooseFormat(info.formats, { quality: 'highest' });

            if (!format) {
                sock.sendMessage(m.chat, { text: 'No se pudo obtener el formato del video o audio.' }, { quoted: m });
                return;
            }

            const readableStream = ytdl.downloadFromInfo(info, { format });

            const buffer = await new Promise((resolve) => {
                const chunks = [];
                readableStream.on('data', (chunk) => chunks.push(chunk));
                readableStream.on('end', () => resolve(Buffer.concat(chunks)));
            });

            if (isAudio) {
                // Envía el audio como un mensaje de voz
                sock.sendMessage(m.chat, {
                    audio: {
                        url: `data:audio/mp4;base64,${buffer.toString('base64')}`,
                    },
                    ppt: true
                }, { quoted: m });
            } else {
                // Convierte el video en formato compatible
                const videoBuffer = await new Promise((resolve) => {
                    ffmpeg(buffer)
                        .inputFormat('mp4')
                        .toFormat('mp4')
                        .on('end', () => resolve())
                        .toBuffer();
                });

                // Envía el video como un mensaje
                sock.sendMessage(m.chat, {
                    video: {
                        url: `data:video/mp4;base64,${videoBuffer.toString('base64')}`,
                    },
                    mimetype: 'video/mp4'
                }, { quoted: m });
            }
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
