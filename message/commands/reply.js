module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {

            const text = m.body.slice(m.body.indexOf(' ') + 1);

            if (m && m.message) {
                const media = m.message
                if (media.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: media.videoMessage.url },
                        mimetype: 'video/mp4',
                        caption: `${text}`
                    }, { quoted: m });
                } else if (message.type === 'imageMessage') {
                    for (const image of media.imageMessage) {
                        sock.sendMessage(m.chat, {
                            image: { url: media.imageMessage.url,
                            mimetype: 'image/jpeg' },
                            caption: `${text}`
                        }, { quoted: m })
                    }
                }
            } else {
                sock.sendMessage(m.chat, {text: text})
            }
        } catch(e) {
            console.log(e)
        }
    }
};
