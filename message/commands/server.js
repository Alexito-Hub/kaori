const os = require('os');
const util = require('util');
const { exec } = require('child_process');

module.exports = {
    name: 'serverinfo',
    description: 'Muestra información del servidor y estado del bot',
    aliases: ['server', 'botinfo'],

    async execute(sock, m) {
        try {
            // Información del servidor
            const serverInfo = {
                '𝙾𝚂': `*${os.type()}*`,
                '𝙰𝚛𝚚𝚞𝚒𝚝𝚎𝚌𝚝𝚞𝚛𝚊': `*${os.arch()}*`,
                '𝚁𝚞𝚗𝚝𝚒𝚖𝚎': `*[ ${formatTime(process.uptime())} ]*`,
                '𝙰𝚕𝚖𝚊𝚌𝚎𝚗𝚊𝚖𝚒𝚎𝚗𝚝𝚘': `*${await getStorageInfo()}*`,
                '𝚁𝙰𝙼': `*${await getRamUsage()}*`
            };

            // Construir y enviar el mensaje de información
            const infoMessage = `🤖 **𝑺𝒆𝒓𝒗𝒆𝒓 𝑺𝒕𝒂𝒕𝒖𝒔**\n\n${formatInfo(serverInfo)}`;

            sock.sendMessage(m.chat, { text: infoMessage }, { quoted: m });
        } catch (error) {
            console.error('Error en la ejecución del comando serverinfo:', error);
        }
    }
};

// Función para formatear la información en un objeto
function formatInfo(infoObj) {
    return Object.entries(infoObj)
        .map(([key, value]) => `│ *${key}:*\n${value}`)
        .join('\n├╶╴╴╴╴╴╴╴╴╴╴╴╴┤\n') + '\n╰╶╴╴╴╴╴╴╴╴╴╴╴╴╯';
}

// Función para formatear el tiempo de actividad (uptime)
function formatTime(uptimeSeconds) {
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
    const seconds = uptimeSeconds % 60;

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
}

// Función para obtener información del almacenamiento
async function getStorageInfo() {
    return new Promise((resolve, reject) => {
        exec('df -h --output=pcent /', (error, stdout) => {
            if (!error) {
                const storagePercent = stdout.trim().split('\n')[1] || 'No disponible';
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
