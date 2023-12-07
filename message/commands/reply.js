module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {

            const message = m.body.slice(m.body.indexOf(' ') + 1);
            const mediaUrl = m.message
            if (m && m.message) {
                const media = mediaUrl
                if (media.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: media.videoMessage.url },
                        mimetype: 'video/mp4',
                        caption: `${message}`
                    }, { quoted: m });
                } else if (media.type === 'imageMessage') {
                    for (const image of media.imageMessage) {
                        sock.sendMessage(m.chat, {
                            image: { url: media.imageMessage.url,
                            mimetype: 'image/jpeg' },
                            caption: `${message}`
                        }, { quoted: m })
                    }
                }
            } else {
                sock.sendMessage(m.chat, {text: message})
            }
        } catch(e) {
            console.log(e)
        }
    }
};
