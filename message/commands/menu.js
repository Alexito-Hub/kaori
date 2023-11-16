// commands/menu.js

module.exports = {
    name: 'menu',
    description: 'Muestra un menú de comandos',
    aliases: ['help', 'commands'],

    async execute(sock, m) {
        const user = m.sender.split('@')[0];

        const menuText = `Hola @${user}.\n{Una frase del día}\nPrefijo {....}\nModo {público}\nActividad {tiempo de actividad del bot}\n\nComandos disponibles:\n- Tester\n- Ping`;

        await v.reply(menuText, { quoted: m });
    }
};
