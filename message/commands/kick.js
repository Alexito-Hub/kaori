module.exports = {
    name: 'kick',
    description: 'Expulsa a un miembro del grupo',
    aliases: ['remove'],
    
    async execute(sock, m, args) {
        try {
            if (!m.isGroup) {
                return;
            }

            const groupInfo = await sock.groupMetadata(m.chat);
            const isAdmin = groupInfo && groupInfo.participants.some(p => p.id == m.sender && ['admin', 'superadmin'].includes(p.admin));
            
            if (!isAdmin) {
                sock.sendMessage(m.chat, { text: 'Solo administradores.' }, { quoted: m });
                return;
            }

            let targetUser;
            if (args.length > 0) {
                targetUser = args[0].replace('@', '').replace(/\s/g, '').split('@')[0] + '@s.whatsapp.net';
            } else if (m.quoted) {
                targetUser = m.quoted.sender;
            } else {
                sock.sendMessage(m.chat, { text: '*kick <@usuario>*' }, { quoted: m });
                return;
            }

            const userObj = groupInfo.participants.find(p => p.id === targetUser);
            
            if (!userObj) {
                sock.sendMessage(m.chat, { text: '¿?' }, { quoted: m });
                return;
            }

            if (['admin', 'superadmin'].includes(userObj.admin)) {
                sock.sendMessage(m.chat, { text: 'No puedo eliminar a un administrador.' }, { quoted: m });
                return;
            }

            await sock.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
            sock.sendMessage(m.chat, {
                contextInfo: {
                    remoteJid: m.chat,
                    mentionedJid: [m.sender, targetUser],
                },
                video: { url: 'https://telegra.ph/file/25ec490a6f4dd4b423110.mp4' },
                gifPlayback: true,
                caption: `ㅤ *⋯⋯ REMOVE ⋯⋯*
 ∘ *Grupo:* ${groupInfo.subject}
 ∘ *Usuario removido:* @${targetUser.split('@')[0]}
 ∘ *Por:* @${m.sender.split('@')[0]}

*©ᴢɪᴏᴏᴏ*`,
            });

        } catch (error) {
            console.log('Error:', error);
            sock.sendMessage(m.chat, { text: `${error}` }, { quoted: m });
        }
    },
};
