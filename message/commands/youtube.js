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
            const format = isAudio ? ytdl.chooseFormat(info.formats, { quality: 'highestaudio' }) : ytdl.chooseFormat(info.formats, { quality: 'highest' });

            if (!format) {
                sock.sendMessage(m.chat, { text: 'No se pudo obtener el formato del video o audio.' }, { quoted: m });
                return;
            }

            const buffer = await ytdl.downloadFromInfo(info, { format });
            
            // Convierte el buffer a base64
            const base64 = buffer.toString('base64');

            // Envía el video como un mensaje con formato adecuado
            sock.sendMessage(m.chat, {
                videoMessage: {
                    url: `data:video/mp4;base64,${base64}`,
                    mimetype: 'video/mp4',
                    fileSha256: Buffer.from(base64, 'base64').toString('hex'),
                }
            }, { quoted: m });
        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
