module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {

            const message = m.body.slice(m.body.indexOf(' ') + 1);
            const mediaUrl = m.message.message;

            if (mediaUrl) {
                const media = mediaUrl;
                
                if (media.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: media.url },
                        mimetype: 'video/mp4',
                        caption: `${message}`
                    }, { quoted: m });
                } else if (media.type === 'imageMessage') {
                    sock.sendMessage(m.chat, {
                        image: { url: media.url, mimetype: 'image/jpeg' },
                        caption: `${message}`
                    }, { quoted: m });
                }
            } else {
                sock.sendMessage(m.chat, { text: message });
            }

        } catch(e) {
            console.log(e)
        }
    }
};
