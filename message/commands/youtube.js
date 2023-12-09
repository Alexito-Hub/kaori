const ytdl = require('ytdl-core');
const { createReadStream } = require('fs');

const sizeLimit = 100 * 1024 * 1024;

module.exports = {
    name: 'youtube',
    description: 'Descarga y envía un video de YouTube en formato 720p',
    aliases: ['yt', 'download'],

    async execute(sock, m, args) {
        try {
            if (args.length !== 1) {
                v.reply('*youtube <url>*');
                return;
            }

            const youtubeUrl = args[0];

            if (await validateUrl(youtubeUrl)) {
                sock.sendMessage(m.chat, { react:{ text: '🕛', key: m.key }});

                const video = await downloadYoutubeVideo(youtubeUrl);

                if (video) {
                    await sendVideo(sock, m, video);
                } else {
                    v.reply('El video supera el límite de 100 MB.');
                }
            } else {
                v.reply('URL de YouTube no válida.');
            }
        } catch (error) {
            console.log(error);
            v.reply('Error al procesar la solicitud.');
        }
    },
};

const validateUrl = async (url) => {
    try {
        const info = await ytdl.getInfo(url);
        return info && info.videoDetails && info.videoDetails.lengthSeconds;
    } catch (error) {
        console.error(error);
        return false;
    }
};

const downloadYoutubeVideo = async (url) => {
    try {
        const info = await ytdl.getInfo(url);

        const format = ytdl.chooseFormat(info.formats, { quality: '136', filter: format => format.container === 'mp4' });

        if (format && format.url) {
            const stream = ytdl.downloadFromInfo(info, { format: format });

            let buffer = Buffer.alloc(0);

            return new Promise((resolve, reject) => {
                stream.on('progress', (chunkLength, downloaded, total) => {
                    if (buffer.length + chunkLength <= sizeLimit) {
                        buffer = Buffer.concat([buffer, stream.read(chunkLength)]);
                    } else {
                        stream.destroy();
                        reject(new Error('El video supera el límite de 100 MB.'));
                    }
                });

                stream.on('end', () => {
                    if (buffer.length <= sizeLimit) {
                        resolve({ buffer: buffer, mimetype: 'video/mp4', caption: 'Video descargado de YouTube' });
                    } else {
                        reject(new Error('El video supera el límite de 100 MB.'));
                    }
                });

                stream.on('error', reject);
            });
        } else {
            throw new Error('Formato de video no válido.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al obtener información del video.');
    }
};

const sendVideo = async (sock, m, video) => {
    try {
        const media = {
            video: Buffer.from(video.buffer),
            mimetype: video.mimetype,
            caption: video.caption,
        };

        await sock.sendMessage(m.chat, media, { quoted: m});
    } catch (error) {
        console.error(error);
        throw new Error('Error al enviar el video.');
    }
};
