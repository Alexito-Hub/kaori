// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Muestra un menú de comandos',
    aliases: ['help', 'commands'],

    async execute(sock, m) {
        const user = m.sender.split('@')[0];
        const prefixList = global.prefix.map(p => `[ ${p} ]`).join(' / ');

        const uptimeSeconds = Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / (24 * 60 * 60));
        const hours = Math.floor((uptimeSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((uptimeSeconds % (60 * 60)) / 60);

        await v.reply(`    *Hola @${user} 🍥*
᳃ "Es momento de levantarse y dar pasos largos para lograr nuestros objetivos"

  *Prefijo:* ${prefixList} 
  *Modo:* Público
  *Actividad:* ${days > 0 ? `${days}d ` : ''}${hours}h ${minutes}m

Para obtener información de algún comando usa "Help <command>"

Comandos disponibles:
- Test
- Ping`, { quoted: m });
    }
};
