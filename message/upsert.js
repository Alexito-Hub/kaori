require('../config')

const fs = require('fs')
const path = require('path');
const util = require('util')

const { Json, removeAccents } = require('../lib/functions')
const { client, sms } = require('../lib/simple')

const commands = [];

function getCommandInfo(commandName) {
  return commands.find(cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName)));
}

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(__dirname, 'commands', file));
  commands.push(command);
}

module.exports = async(sock, m, store) => {
	try {
		sock = client(sock)
		v = await sms(sock, m)
		
		const prefix = global.prefix
		const prefixes = global.prefix || ['#'];
		const isCmd = prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()))
		const command = isCmd
          ? removeAccents(m.body.slice(prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()))).trim().split(' ')[0].toLowerCase())
          : m.body.trim().split(' ')[0].toLowerCase();
		
		const args = m.body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const senderNumber = m.sender.split('@')[0]
		const botNumber = sock.user.id.split(':')[0]
		
		const user = m.sender.split('@')[0];
		
		const groupMetadata = m.isGroup ? await sock.groupMetadata(v.chat) : {}
		const groupMembers = m.isGroup ? groupMetadata.participants : []
		const groupAdmins = m.isGroup ? sock.getGroupAdmins(groupMembers) : false
		
		const isMe = (botNumber == senderNumber)
		const isBotAdmin = m.isGroup ? groupAdmins.includes(botNumber + '@s.whatsapp.net') : false
		const isOwner = owner.includes(senderNumber) || isMe
		const isStaff = staff.includes(senderNumber) || isOwner
		const isEval = isOwner || isStaff
		
		const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
		const isQuotedMsg = m.quoted ? (m.quoted.type === 'conversation') : false
		const isQuotedImage = m.quoted ? (m.quoted.type === 'imageMessage') : false
		const isQuotedVideo = m.quoted ? (m.quoted.type === 'videoMessage') : false
		const isQuotedSticker = m.quoted ? (m.quoted.type === 'stickerMessage') : false
		const isQuotedAudio = m.quoted ? (m.quoted.type === 'audioMessage') : false
		
        const hasCommandPrefix = prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()));
        const commandBody = hasCommandPrefix ? m.body.slice(prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase())).length).trim() : m.body.trim();
        const [commandName, ...commandArgs] = commandBody.split(/ +/);
        
        const commandInfo = getCommandInfo(commandName.toLowerCase());
        if (commandInfo) {
            await commandInfo.execute(sock, m, commandArgs);
            return;
        }
			
		if (isOwner) {
		    if (v.body.startsWith('$')) {
    		    try {
    		        const command = v.body.slice(1);
    		        const { exec } = require('child_process');
    		        exec(command, (error, stdout, stderr) => {
    		            if (error) {
    		                sock.sendMessage(m.chat, {text:`${error.message}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}}, {quoted:m});
    		                return;
    		            }
    		            if (stderr) {
    		                sock.sendMessage(m.chat, {text:`${stderr}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}
    		                }, {quoted:m});
    		                return;
    		            }
    		            sock.sendMessage(m.chat, {text:`${stdout}`,contextInfo: {externalAdReply: {showAdAttribution: true,}}}, {quoted:m});
    		        });
    		    } catch (e) {
    		        sock.sendMessage(m.chat, { text:`${e.message}`, contextInfo: { externalAdReply: {showAdAttribution: true, }}}, {quoted:m});
    		    }
    		}
		}
		
		
		switch (command) {
			default:
			if (isEval) {
				if (v.body.startsWith('>')) {
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
