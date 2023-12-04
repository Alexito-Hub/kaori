const os = require('os');
const util = require('util');
const { exec } = require('child_process');

module.exports = {
    name: 'serverinfo',
    description: 'Muestra información del servidor y estado del bot',
    aliases: ['server', 'botinfo'],

    async execute(sock, m) {
        try {
            const uptimeSeconds = Math.floor(process.uptime());
            const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
            const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
            const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
            const seconds = uptimeSeconds % 60;
            const formattedTime = `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            function roundTime(time) {
                return Math.round(time);
            }
            const responseMs = Date.now();
            const responseTime = roundTime(responseMs - m.messageTimestamp * 1000);
            const formattedResponseTime = (responseTime / 1000).toFixed(3);
            
            const serverInfo = {
                '𝙸𝙳': `*${process.pid}*`,
                '𝙾𝚂': `*${os.type()}*`,
                '𝙰𝚛𝚌𝚑𝚞𝚝𝚎𝚌𝚝𝚞𝚛𝚎': `*${os.arch()}*`,
                '𝚂𝚝𝚘𝚛𝚊𝚐𝚎': `*${await getStorageInfo()}*`,
                '𝚁𝙰𝙼': `*${await getRamUsage()}*`,
                '𝙽𝚘𝚍𝚎 𝚓𝚜': `*${process.version}*`,
                '𝚁𝚞𝚗𝚝𝚒𝚖𝚎': `*[ ${formattedTime} ]*`,
                '𝚂𝚙𝚎𝚎𝚍': `*${formattedResponseTime} ms*`,
                '𝙾𝚠𝚗𝚎𝚛': `*ziooo_zip*`
                
            };

            // Construir y enviar el mensaje de información
            const infoMessage = `ㅤ *𝑲𝒂𝒐𝒓𝒊 𝑺𝒕𝒂𝒕𝒖𝒔*\n\n╭╶╴╴╴╴╴╴╴╴╴╴╴╴╮\n${formatInfo(serverInfo)}`;

            sock.sendMessage(m.chat, {
                text: infoMessage,
                contextInfo: {
                    externalAdReply: {
                        title:`Server Status`,
                        body:`${process.cwd()}`,
                        thumbnailUrl: `https://telegra.ph/file/ae78c6675b0f413a5c635.jpg`
                        
                    }
                }
            }, { quoted: m });
        } catch (error) {
            console.log('Error en la ejecución del comando serverinfo:', error);
        }
    }
};

// Función para formatear la información en un objeto
function formatInfo(infoObj) {
    return Object.entries(infoObj)
        .map(([key, value]) => `│ *${key}:*\n│ㅤ ${value}`)
        .join('\n├╶╴╴╴╴╴╴╴╴╴╴╴╴┤\n') + '\n╰╶╴╴╴╴╴╴╴╴╴╴╴╴╯\n\n*ᴅᴇʀᴇᴄʜᴏs ʀᴇsᴇʀᴠᴀᴅᴏs © ᴀʟᴇxɪᴛᴏ*';
}

// Función para obtener información del almacenamiento
async function getStorageInfo() {
    return new Promise((resolve, reject) => {
        exec('df -h --output=pcent /', (error, stdout) => {
            if (!error) {
                const storagePercent = stdout.trim().split(' ')[1] || 'No disponible';
                resolve(storagePercent);
            } else {
                reject(error);
            }
        });
    });
}

// Función para obtener información del uso de RAM
async function getRamUsage() {
    return new Promise((resolve, reject) => {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const usedMemoryPercent = (usedMemory / totalMemory * 100).toFixed(2) + '%';
        resolve(usedMemoryPercent);
    });
}
