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
                'Sistema Operativo': os.platform(),
                'Arquitectura': os.arch(),
                'Memoria Total': formatBytes(os.totalmem()),
                'Memoria Libre': formatBytes(os.freemem())
            };

            // Información del bot
            const botInfo = {
                'Versión de Node.js': process.version,
                'Uptime del Bot': formatUptime(process.uptime()),
                'Número de Usuarios': Object.keys(sock.chats).length
            };

            // Ejecutar el comando "git rev-parse --short HEAD" para obtener la versión del código (hash corto)
            exec('git rev-parse --short HEAD', (error, stdout) => {
                if (!error) {
                    botInfo['Versión del Código'] = stdout.trim();
                }

                // Construir y enviar el mensaje de información
                const infoMessage = `🤖 **Información del Servidor y Estado del Bot** 🖥️\n\n` +
                    `**Información del Servidor**:\n${formatInfo(serverInfo)}\n\n` +
                    `**Información del Bot**:\n${formatInfo(botInfo)}`;

                sock.sendMessage(m.chat, { text: infoMessage }, { quoted: m });
            });
        } catch (error) {
            console.error('Error en la ejecución del comando serverinfo:', error);
        }
    }
};

// Función para formatear bytes
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Función para formatear el tiempo de actividad (uptime)
function formatUptime(uptimeSeconds) {
    const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
    const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);
    const seconds = uptimeSeconds % 60;

    return `${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m ${seconds}s`;
}

// Función para formatear la información en un objeto
function formatInfo(infoObj) {
    return Object.entries(infoObj)
        .map(([key, value]) => `• ${key}: ${value}`)
        .join('\n');
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})
