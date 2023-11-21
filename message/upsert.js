require('../config');

const fs = require('fs')
const path = require('path');
const util = require('util')

const { db} = require('../database')

const { Json, removeAccents } = require('../lib/functions')
const { client, sms } = require('../lib/simple')

let areCommands = true;

const commands = [];

function saveConfig(data) {
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2));
}
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
		
		const command = isCmd ? removeAccents(m.body.slice(prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase())).length)).trim().split(' ').shift().toLowerCase() : m.body.trim().split(' ').shift().toLowerCase();
        const args = m.body.trim().split(/ +/).slice(1);
        const argsSplit = m.body.trim().split(/ +/)

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
        
        
        switch (command) {
			default:
			if (isEval) {
				if (v.body.startsWith('^')) {
					try {
						await v.reply(Json(eval(q)))
					} catch(e) {
						await v.reply(String(e))
					}
				}
			}
		}
        
        if (commandName.toLowerCase() === 'saff') {
          if (isOwner) {
            const [_, state] = argsSplit
            if (state === 'on' || state === 'off') {
              const isEnabled = state === 'on';
              if (areCommands === isEnabled) {
                await v.reply(`Los comandos ya están ${isEnabled ? 'habilitados' : 'deshabilitados'}.`);
              } else {
                areCommands = isEnabled;
                await v.reply(`Los comandos han sido ${isEnabled ? 'habilitados' : 'deshabilitados'}.`);
        
                // Guardar la configuración en config.json
                const configData = {
                  areCommands: isEnabled,
                };
                fs.writeFileSync(configFile, JSON.stringify(configData, null, 2));
              }
            } else {
              await v.reply('Comando no válido. Use "on" o "off" para habilitar o deshabilitar comandos.');
            }
          } else {
            await v.reply('No tienes permisos para ejecutar este comando.');
          }
          return;
        }

        
        if (areCommandsEnabled) {
            const commandInfo = getCommandInfo(commandName.toLowerCase());
            if (commandInfo) {
              await commandInfo.execute(sock, m, commandArgs);
              return;
            }
          return;
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
