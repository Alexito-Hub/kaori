const fs = require('fs');
const path = require('path');

const versionFilePath = path.join(__dirname, '../versions.json');

function loadVersions() {
  try {
    const data = fs.readFileSync(versionFilePath);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function saveVersions(versions) {
  fs.writeFileSync(versionFilePath, JSON.stringify(versions, null, 2));
}

module.exports = {
  name: 'version',
  description: 'Comando para gestionar versiones del bot',
  aliases: ['versión', 'v', 'v-'],
  ownerOnly: true,

  async execute(sock, m, args) {
    const command = args[0];

    if (command === 'list') {
      const versions = loadVersions();
      let response = 'Esta es la lista de versiones:\n';

      for (const version of versions) {
        response += `Fecha: ${version.date}\nVersión: ${version.version}\n`;
      }

      await sock.sendMessage(m.chat, response, MessageType.text, { quoted: m });
    } else if (command === 'update' || command === 'demote') {
      const versionNumber = args[1];
      const note = args.slice(2).join(' ');

      if (!versionNumber || !note) {
        await sock.sendMessage(m.chat, {text:'Por favor, proporciona el número de versión y una nota.'}, { quoted: m });
        return;
      }

      const versions = loadVersions();
      const existingVersion = versions.find((v) => v.version === versionNumber);

      if (command === 'update') {
        if (existingVersion) {
          await sock.sendMessage(m.chat, {text:`La versión ${versionNumber} ya existe.`}, { quoted: m });
          return;
        }

        const newVersion = {
          version: versionNumber,
          date: new Date().toISOString().split('T')[0],
          note,
        };
        versions.push(newVersion);
        saveVersions(versions);

        // Envia mensaje a la comunidad
        await sock.sendMessage('120363045082679745@g.us', {text:`Nueva versión: ${versionNumber}\nNota: ${note}`});
        await sock.sendMessage(m.chat, {text:`Versión actualizada: ${versionNumber}\nNota: ${note}`}, { quoted: m });
      } else if (command === 'demote') {
        if (!existingVersion) {
          await sock.sendMessage(m.chat, {text:`La versión ${versionNumber} no existe.`}, { quoted: m });
          return;
        }

        const index = versions.indexOf(existingVersion);
        versions.splice(index, 1);
        saveVersions(versions);

        // Envia mensaje a la comunidad
        await sock.sendMessage('120363045082679745@g.us', {text:`Versión eliminada: ${versionNumber}\nNota: ${note}`});
        await sock.sendMessage(m.chat, {text:`Versión removida: ${versionNumber}\nNota: ${note}`}, { quoted: m });
      }
    } else {
      const versions = loadVersions();
      const latestVersion = versions.length > 0 ? versions[versions.length - 1].version : 'No hay versiones';

      await sock.sendMessage(m.chat, `Bot: Versión del bot: ${latestVersion}`, MessageType.text, { quoted: m });
    }
  },
};
