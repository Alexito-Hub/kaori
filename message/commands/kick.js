module.exports = {
    name: 'kick',
    description: 'Expulsa a un miembro del grupo',
    aliases: ['remove'],
    
    async execute(sock, m, args) {
        try {
            const groupInfo = await sock.groupMetadata(m.chat);
            const isAdmin = groupInfo && groupInfo.participants.some(p => p.id == m.sender && ['admin', 'superadmin'].includes(p.admin));
            if (args.length === 0 && !m.quoted) {
                sock.sendMessage(m.chat, {text:'*kick <@usuario>*'}, { quoted: m });
                return;
            }
            
            const userObj = m.quoted.split('@')[0]
            const user = m.sender.split('@')[0];
            
            const targetUser = (args.length > 0) ? args[0].replace('@', '').replace(/\s/g, '').split('@')[0] + '@s.whatsapp.net' : m.quoted.sender;
            
            if (isAdmin) {
                await sock.groupParticipantsUpdate(m.chat, [targetUser], 'remove');
                sock.sendMessage(m.chat, {
                    contextInfo:{
                        remoteJid:m.chat,
                        mentionedJid:[m.sender, m.quoted]
                    },
                    video: {url: 'https://telegra.ph/file/25ec490a6f4dd4b423110.mp4'},
                    gifPlayback: true,
                    caption: `Usuario @${userObj} expulsado del grupo por @${user}`,
                })
            } else {
                sock.sendMessage(m.chat, {text:'Solo los administradores pueden expulsar a miembros del grupo.'}, { quoted: m });
            }
        }catch (error) {
            console.error('Error:', error);
            sock.sendMessage(m.chat, {text:'Error al ejecutar el comando'}, { quoted: m });
            
        }
        
    },
};
