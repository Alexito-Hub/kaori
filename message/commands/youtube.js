const ytdl = require('ytdl-core');
const sizeLimit = 100 * 1024 * 1024;

module.exports = {
    name: 'youtube',
    description: 'Descarga un video de YouTube',
    aliases: ['yt', 'download'],

    async execute(sock, m, args) {
        try {
            if (args.length !== 1) {
                v.reply('*youtube <url>*');
                return;
            }

            const youtubeUrl = args[0];

            if (await validateUrl(youtubeUrl)) {
                sock.sendMessage(m.chat, { react: { text: '🕛', key: m.key } });
                const video = await downloadYoutubeVideo(youtubeUrl);

                if (video) {
                    await sendVideo(sock, m, video);
                }
            } else {
                v.reply('URL de YouTube no válida.');
            }
        } catch (error) {
            console.log(error);
            v.reply('Error al procesar el comando.');
        }
    }
};

const validateUrl = async (url) => {
    try {
        if (ytdl.validateURL(url)) {
            const videoId = ytdl.getURLVideoID(url);

            if (ytdl.validateID(videoId)) {
                return true;
            } else {
                throw new Error('Error al obtener información.');
            }
        } else {
            throw new Error('URL de YouTube no válida.');
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

const downloadYoutubeVideo = async (url) => {
    try {
        const info = await ytdl.getInfo(url);

        const format = ytdl.chooseFormat(info.formats, { quality: '136', filter: format => format.container === 'mp4' });

        let buffer = Buffer.alloc(0);
        let canceled = false;

        const stream = ytdl.downloadFromInfo(info, { format: format });
        
        stream.on('progress', (chunkLength, downloaded, total) => {
            const chunk = stream.read(chunkLength);
        
            if (chunk) {
                buffer = Buffer.concat([buffer, chunk]);
            }
        
            if (buffer.length > sizeLimit) {
                stream.destroy();
        
                canceled = true;
                throw new Error('El video supera el límite de 100 MB.');
            }
        });

        await new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });

        if (canceled) {
            return null;
        } else {
            return { buffer: buffer, mimetype: 'video/mp4', caption: 'Video descargado de YouTube' };
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error al descargar el video.');
    }
};

const sendVideo = async (sock, m, video) => {
    try {
        sock.sendMessage(m.chat, { video: { url: video }, mimetype: 'video/mp4', caption: 'gay'}, { quoted: m });
    } catch (error) {
        console.log(error);
        throw new Error('Error al enviar el video.');
    }
};
