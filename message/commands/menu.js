// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Muestra un menú de comandos',
    aliases: ['help', 'commands'],

    async execute(sock, m) {
        const user = m.sender.split('@')[0];

        await v.reply(`    *Hola @${user} 🍥*
᳃ "Es momento de levantarse y dar pasos largos para lograr nuestros objetivos"

  *Prefijo:* ${global.prefix} 
  *Modo:* Publico
  *Actividad:* 00.00.00

Para Obtener la información de algun comando usa "Help <command>

Comandos Disponibles:
- Test
- Ping`, { quoted: m });
    }
};
