const ytdl = require('ytdl-core')
const sizeLimit = 100 * 1024 * 1024

module.exports = {
    name: 'youtube',
    description: 'Descarga un video de YouTube',
    aliases: ['yt', 'download'],

    async execute(sock, m, args) {
        if (args.length !== 1) {
            v.reply('*youtube <url>*');
            return;
        }

        const youtubeUrl = args[0];

        if (await validateUrl(youtubeUrl)) {
            const video = await downloadYoutubeVideo(youtubeUrl);

            await sendVideo(sock, m, video);
        } else {
            v.reply('URL de YouTube no válida.');
        }
    }
};

const validateUrl = async (url) => {
    if (ytdl.validateURL(url)) {
        const videoId = ytdl.getURLVideoID(url);

        if (ytdl.validateID(videoId)) {
            return true;
        } else {
            v.reply('Error al obtener información.');
            return false;
        }
    } else {
        v.reply('URL de YouTube no válida.');
        return false;
    }
};

const downloadYoutubeVideo = async (url) => {
    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: format => format.container === 'mp4' });

    let buffer = Buffer.alloc(0);

    let canceled = false;

    const stream = ytdl.downloadFromInfo(info, { format: format });

    stream.on('progress', (chunkLength, downloaded, total) => {
        buffer = Buffer.concat([buffer, stream.read(chunkLength)]);

        if (buffer.length > sizeLimit) {
            stream.destroy();

            v.reply('El video supera el límite de 100 MB.');

            canceled = true;
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
};

const sendVideo = async (sock, m, video) => {
    if (video) {

        sock.sendMessage(m.chat, { video: video }, { quoted: m });
    }
};
