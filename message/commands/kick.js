module.exports = {
    name: 'kick',
    description: 'Expulsa a un miembro del grupo',
    aliases: ['remove'],
    
    async execute(sock, m, args) {
        try {
            if (!m.isGroup) {
                sock.sendMessage(m.chat, { text: 'Este comando solo se puede usar en grupos.' }, { quoted: m });
                return;
            }

            const groupInfo = await sock.groupMetadata(m.chat);
            const isAdmin = groupInfo && groupInfo.participants.some(p => p.id == sock.user.id && ['admin', 'superadmin'].includes(p.admin));
            
            if (!isAdmin) {
                sock.sendMessage(m.chat, { text: 'El bot necesita ser administrador del grupo para usar este comando.' }, { quoted: m });
                return;
            }

            const userObj = groupInfo.participants.find(p => p.id === targetUser);
            
            if (!userObj) {
                sock.sendMessage(m.chat, { text: 'El usuario especificado no está en el grupo.' }, { quoted: m });
                return;
            }

            if (['admin', 'superadmin'].includes(userObj.admin)) {
                sock.sendMessage(m.chat, { text: 'No puedes expulsar a un administrador del grupo.' }, { quoted: m });
                return;
            }

            let targetUser;
            if (args.length > 0) {
                targetUser = args[0].replace('@', '').replace(/\s/g, '').split('@')[0] + '@s.whatsapp.net';
            } else if (m.quoted) {
                targetUser = m.quoted.sender;
            } else {
                sock.sendMessage(m.chat, { text: 'Usa el formato *kick <@usuario>* o responde al mensaje del usuario que deseas expulsar.' }, { quoted: m });
                return;
            }

            await sock.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
            sock.sendMessage(m.chat, {
                contextInfo: {
                    remoteJid: m.chat,
                    mentionedJid: [targetUser],
                },
                video: { url: 'https://telegra.ph/file/25ec490a6f4dd4b423110.mp4' },
                gifPlayback: true,
                caption: `Usuario @${targetUser.split('@')[0]} expulsado del grupo por @${m.sender.split('@')[0]}`,
            });

        } catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, { text: 'Error al ejecutar el comando' }, { quoted: m });
        }
    },
};
