require('../config')

const fs = require('fs')
const path = require('path');
const util = require('util')

const { Json, removeAccents } = require('../lib/functions')
const { client, sms } = require('../lib/simple')

module.exports = async(sock, m, store) => {
	try {
		sock = client(sock)
		v = await sms(sock, m)
		
		const prefix = global.prefix
		const prefixes = global.prefix || ['#'];
		const isCmd = prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()))
		const command = isCmd ? removeAccents(m.body.slice(prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase())).length)).trim().split(' ').shift().toLowerCase() : m.body.trim().split(' ').shift().toLowerCase();

		
		const args = m.body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const senderNumber = m.sender.split('@')[0]
		const botNumber = sock.user.id.split(':')[0]
		
		const groupMetadata = m.isGroup ? await sock.groupMetadata(v.chat) : {}
		const groupMembers = m.isGroup ? groupMetadata.participants : []
		const groupAdmins = m.isGroup ? sock.getGroupAdmins(groupMembers) : false
		
		const isMe = (botNumber == senderNumber)
		const isBotAdmin = m.isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false
		const isOwner = owner.includes(senderNumber) || isMe
		const isStaff = staff.includes(senderNumber) || isOwner
		
		const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
		const isQuotedMsg = m.quoted ? (m.quoted.type === 'conversation') : false
		const isQuotedImage = m.quoted ? (m.quoted.type === 'imageMessage') : false
		const isQuotedVideo = m.quoted ? (m.quoted.type === 'videoMessage') : false
		const isQuotedSticker = m.quoted ? (m.quoted.type === 'stickerMessage') : false
		const isQuotedAudio = m.quoted ? (m.quoted.type === 'audioMessage') : false
		
		const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
          const command = require(path.join(__dirname, 'commands', file));
    
          const allAliases = [command.name, ...(command.aliases || [])];
          if (allAliases.includes(command)) {
            // Ejecuta el comando correspondiente
            await command.execute(sock, m);
            return;
          }
        }
		
		switch (command) {
case 'Menu':
    break;
case 'help':
    break
		}
		
		switch (command) {
			default:
			if (isOwner) {
				if (v.body.startsWith('^')) {
					try {
						await v.reply(Json(eval(q)))
					} catch(e) {
						await v.reply(String(e))
					}
				}
			}
		}
		
	} catch (e) {
		console.log(e)
	}
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
