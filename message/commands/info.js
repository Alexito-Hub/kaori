const os = require('os');
const process = require('process');

module.exports = {
    name: 'info',
    description: 'Muestra información sobre el bot y el sistema',
    aliases: ['about', 'botinfo'],

    async execute(sock, m) {
        try {
            const botDescription = 'Un increíble bot de WhatsApp'; // Reemplaza con la descripción de tu bot

            await sock.sendMessage(m.chat, { text: `
🤖 *${global.name} - Información del Bot y del Sistema* 🤖

- *Versión del Bot:* ${global.version}
- *Descripción:* ${botDescription}
- *Propietario:* ${global.owner.join(', ')}
- *Prefijo de Comandos:* ${global.prefix.map(p => `\`${p}\``).join(', ')}

ℹ️ *Información del Sistema* ℹ️
- *Sistema Operativo:* ${os.platform()} ${os.arch()}
- *Versión de Node.js:* ${process.versions.node}
- *Memoria Total:* ${Math.round(os.totalmem() / (1024 * 1024))} MB
- *Memoria Libre:* ${Math.round(os.freemem() / (1024 * 1024))} MB

⚙️ *Información del Servidor* ⚙️
- *Hostname:* ${os.hostname()}
- *Tipo de CPU:* ${os.cpus()[0].model}
- *Número de CPUs:* ${os.cpus().length}
- *Directorio de Inicio:* ${os.homedir()}

Este bot es genial, ¡disfrútalo! 🚀
            ` }, { quoted: m });
        } catch (error) {
            console.error('Error en la ejecución del comando info:', error);
        }
    }
};
