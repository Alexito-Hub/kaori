module.exports = {
    name: 'tag',
    description: 'Reenvía el mensaje, incluyendo texto, audio o video.',
    aliases: ['tag'],

    async execute(sock, m) {
        try {

            const text = m.body.slice(m.body.indexOf(' ') + 1);
            
            if (m) {
                if (message.type === 'videoMessage') {
                    sock.sendMessage(m.chat, {
                        video: { url: message.videoMessage.url },
                        mimetype: 'video/mp4',
                        caption: `${text}`
                    }, { quoted: m });
                } else if (message.type === 'imageMessage') {
                    for (const image of message.imageMessage) {
                        sock.sendMessage(m.chat, {
                            image: { url: message.imageMessage.url,
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
