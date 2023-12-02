const os = require('os');
const process = require('process');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

module.exports = {
    name: 'info',
    description: 'Muestra información detallada sobre el bot y el sistema',
    aliases: ['about', 'botinfo'],

    async execute(sock, m) {
        try {
            const botDescription = 'Un increíble bot de WhatsApp'; // Reemplaza con la descripción de tu bot

            const systemInfo = `- *Bot:* ${global.name}

- *Versión:* ${global.version}
- *Descripción:* ${botDescription}
- *Propietario:* ${global.owner.join(', ')}
- *Prefijo:* ${global.prefix.map(p => `[ ${p} ]`).join(' ')}

 - SISTEMA -
- *OS:* ${os.platform()} ${os.arch()}
- *RAM:* ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}
- *Almacenamiento:* ${getStorageUsage()}%

 - PROCESOS -
- *ID:* ${process.pid}
- *Dirección:* ${process.cwd()}
- *CPU usado:* ${await getCpuUsage()}%
- *Node.js:* ${process.platform}
- *Red:* ${formatBytes(os.networkInterfaces()['wlan0'][0]?.rx || 0)} / ${formatBytes(os.networkInterfaces()['wlan0'][0]?.tx || 0)}

Este bot es genial, ¡disfrútalo! 🚀
            `;

            // Utiliza m.reply para enviar la información al remitente
            await sock.sendMessage(m.chat, { text: systemInfo }, { quoted: m });
        } catch (error) {
            v.reply(`${error}`)
            console.error('Error en la ejecución del comando info:', error);
        }
    }
};

async function getCpuUsage() {
    try {
        const { stdout } = await exec('ps -p $(pgrep -d, -x node) -o %cpu');
        const usage = stdout.split('\n')[1].trim();
        return usage || 'No disponible';
    } catch (error) {
        console.error('Error al obtener el uso de la CPU:', error);
        return 'No disponible';
    }
}

async function getLoggedInUsers() {
    try {
        const { stdout } = await exec('who | cut -d" " -f1 | sort | uniq');
        const users = stdout.trim().split('\n');
        return users.length > 0 ? users.join(', ') : 'Ninguno';
    } catch (error) {
        console.error('Error al obtener usuarios conectados:', error);
        return 'No disponible';
    }
}

function getTotalStorage() {
    return os.totalmem();
}

function getFreeStorage() {
    return os.freemem();
}

function getStorageUsage() {
    const totalStorage = getTotalStorage();
    const freeStorage = getFreeStorage();
    return ((totalStorage - freeStorage) / totalStorage * 100).toFixed(2);
}

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
