require('../config');

const fs = require('fs')
const path = require('path');
const { exec } = require('child_process');
const util = require('util')

const { Json, removeAccents, dbManager } = require('../lib/functions')
const { client, sms } = require('../lib/simple')
const commands = require('../message/commands/commands');
const { getDatabase, updateDatabase, filePath, configData } = require('../lib/database');

let areCommands = true;

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
		const db = getDatabase()
		const pushDb = dbManager
		updateDatabase(db)
		const defaultData = configData()
		const prefixes = db.prefixes || ['#'];
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
		const isOwner = db.owner.includes(senderNumber) || isMe
		const isStaff = db.staff.includes(senderNumber) || isOwner
		const userEval = db.evaluate.includes(senderNumber) || isStaff
		
		const isMedia = (m.type === 'imageMessage' || m.type === 'videoMessage')
		const isQuotedMsg = m.quoted ? (m.quoted.type === 'conversation') : false
		const isQuotedImage = m.quoted ? (m.quoted.type === 'imageMessage') : false
		const isQuotedVideo = m.quoted ? (m.quoted.type === 'videoMessage') : false
		const isQuotedSticker = m.quoted ? (m.quoted.type === 'stickerMessage') : false
		const isQuotedAudio = m.quoted ? (m.quoted.type === 'audioMessage') : false
		
		const hasCommandPrefix = prefixes.some(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase()));
		const commandBody = hasCommandPrefix ? m.body.slice(prefixes.find(prefix => m.body.toLowerCase().startsWith(prefix.toLowerCase())).length).trim() : m.body.trim();
		const [commandName, ...commandArgs] = commandBody.split(/ +/)
		
		switch (command) {
			default:
			    if (userEval) {
        			if (v.body.startsWith('+')) {
                        v.reply('Parece que hay un bug en la libreria @WhiskeySockets/Baileys')
                        /*if (m.hasQuotedMsg && (m.quotedMsg.type === 'image' || m.quotedMsg.type === 'chat') && m.quotedMsg.filename) {
                            const fileName = m.quotedMsg.filename;
                            const fileExt = path.extname(fileName);
                            const filePath = `${__dirname}/test/commands/${fileName}`;
                            const fileData = m.quotedMsg.type === 'image' ? m.quotedMsg.filedata : await sock.downloadMediaMessage(m.quotedMsg);
                            if (fileExt.match(/\.js$/i)) {
                                try {
                                    await fs.promises.writeFile(filePath, fileData);
                                    // Confirmar la adición exitosa del archivo
                                    v.reply(`El archivo => ${fileName} fue agregado`);
                                } catch (err) {
                                    // Manejar el error si no se puede guardar el archivo
                                    v.reply(`No se pudo agregar el archivo => ${fileName}.`);
                                }
                            } else {
                                v.reply('Este no es un archivo Javascript.');
                            }
                        } else {
                            v.reply('Donde esta el archivo? 👀.');
                        }*/
                    }

                    if (v.body.startsWith('-')) {
                        v.reply('Parece que hay un bug en la libreria @WhiskeySockets/Baileys')
                        /*if (args.length === 1 && args[0].endsWith('.js')) {
                            const fileName = args[0];
                            const filePath = path.join(__dirname, 'test', 'commands', fileName);
                            try {
                                fs.unlinkSync(filePath);
                                await v.reply(`Ell archivo ${fileName} fue eliminado.`);
                            } catch (error) {
                                await v.reply(`Error al eliminar ${fileName}.`);
                            }
                        } else {
                            await v.reply('"- <nombre_archivo.js>"');
                        }*/
                    }
                    
                    if (v.body.startsWith('$')) {
                        try {
                            const command = v.body.slice(1);
                            const { exec } = require('child_process');
                            exec(command, (error, stdout, stderr) => {
                                if (error) {
                                    v.reply(`${error.message}`);
                                    return;
                                }
                                if (stderr) {
                                    v.reply(`${stderr}`);
                                    return;
                                }
                                v.reply(`${stdout}`);
                            });
                        } catch (e) {
                            v.reply(`${e.message}`);
                        }
                    }
    				if (v.body.startsWith('>')) {
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

        if (areCommands) {
            const commandInfo = commands.find(cmd => cmd.name === commandName.toLowerCase() || (cmd.aliases && cmd.aliases.includes(commandName.toLowerCase())));
            if (commandInfo) {
                await commandInfo.execute(sock, m, commandArgs);
                return;
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
