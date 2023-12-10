require('../../config');
const { fetchJson } = require('../../lib/utils')


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'tagall',
    description: 'Etiqueta a todos los miembros de los grupos en los que participa el bot',
    aliases: ['tag', 'todos', 'all'],

    async execute(sock, m, args) {
        try {
            const isOwner = owner.includes(m.sender.split('@')[0]);
            const isStaff = staff.includes(m.sender.split('@')[0]) || isOwner

            if (!isStaff) {
                // Si no es staff, enviar un mensaje indicando que no tiene permisos
                await sock.sendMessage(m.chat, { text: 'Solo el staff tiene permiso para usar este comando.' }, { quoted: m });
                return;
            }

            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);

            for (const groupId of groupIds) {
                await sleep(1500);
                
                const response = m
                const result = response.message
                if (response && response.message) {
                    const result = response.message;
                    if (result === 'videoMessage') {
                        sock.sendMessage(m.chat, {text:`${result.videoMessage.url}`})
                        sock.sendMessage(m.chat, {
                            video: { url: result.videoMessage.url },
                            mimetype: 'video/mp4',
                            caption: `ㅤ`
                        }, {quoted:m});
                    } else if (result === 'imageMessage') {
                        for (const image of result.imageMessage) {
                            sock.sendMessage(m.chat, {
                                image: { url: image.imageMessage.url, mimetype: 'image/jpeg' },
                                caption: `ua,`
                            }, {quoted:m});
                        }
                    }
                } else {
                    console.log('Error al obtener información de TikTok');
                    v.reply('Parece que hubo un problema');
                }
            }
            await sock.sendMessage(m.chat, { text: 'Envío de mensaje correcto.' }, { quoted: m });
        } catch (error) {
            console.log(error);
            await sock.sendMessage(m.chat, { text: 'Error al realizar el envío de mensajes' }, { quoted: m });
        }
    },
};

