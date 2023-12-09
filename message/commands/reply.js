require('../../config');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    name: 'tagall',
    description: 'Etiqueta a todos los miembros de los grupos en los que participa el bot',
    aliases: ['tag', 'todos', 'all'],

    async execute(sock, m, args) {
        try {

            const groups = await sock.groupFetchAllParticipating();
            const groupIds = Object.keys(groups);

            const message = args.join(' ');
            if (!message) return await sock.sendMessage(m.chat, { text: '¿Falta de ideas para un mensaje?' }, { quoted: m });

            for (const groupId of groupIds) {
                await sleep(1500);
                await sock.sendMessage(groupId, { 
                    text: message, 
                    contextInfo: { remoteJid: groupId },
                });
            }

            await sock.sendMessage(m.chat, { text: 'Envío de mensaje correcto.' }, { quoted: m });
        } catch (error) {
            console.log(error);
            await sock.sendMessage(m.chat, { text: 'Error al realizar el envío de mensajes' }, { quoted: m });
        }
    },
};


const executeBc = async (text) => {
    try {
        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);


        for (const groupId of groupIds) {
            const fgclink = {
                key: {
                    participant: '0@s.whatsapp.net',
                    ...(groupId ? { remoteJid: groupId } : {}),
                },
                message: {
                    'extendedTextMessage': {
                        text: 'Desarrollado por Ziooo',
                    },
                },
            };
            
            await sock.sendMessage(groupId, { 
                text, 
                contextInfo: {remoteJid:groupId, externalAdReply: {sourceUrl:'https://whatsapp.com/channel/0029VaBQgoGLdQehR6vmiY42', thumbnailUrl: 'https://telegra.ph/file/ae78c6675b0f413a5c635.jpg'}}}, {quoted: fgclink});
        }
    } catch (error) {
        console.log(error);
    }
};

executeBc('os amo');